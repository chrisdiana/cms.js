/**
 * CMS.js v2.0.0
 * Copyright 2018 Chris Diana
 * https://chrisdiana.github.io/cms.js
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
var CMS = function(config) {
  'use strict';

  var container;
  var messageContainer;

  this.ready = false;
  this.routes = {};
  this.collections = {};
  this.filteredCollections = {};

  // Config defaults
  var defaults = {
    elementId: null,
    layoutDirectory: null,
    defaultView: null,
    errorLayout: null,
    mode: 'SERVER',
    github: null,
    types: [],
    plugins: [],
    frontMatterSeperator: '---',
    listAttributes: ['tags'],
    dateParser: /\d{4}-\d{2}(?:-\d{2})?/,
    extension: '.md',
    sort: undefined,
    markdownEngine: null,
    debug: false,
    messageClassName: 'cms-messages',
    onload: function() {},
    onroute: function() {},
  };

  // Messages
  var msg = {
    NO_FILES_ERROR: 'ERROR: No files in directory',
    ELEMENT_ID_ERROR: 'ERROR: No element ID or ID incorrect. Check "elementId" parameter in config.',
    DIRECTORY_ERROR: 'ERROR: Error getting files. Make sure there is a directory for each type in config with files in it.',
    GET_FILE_ERROR: 'ERROR: Error getting the file',
    LAYOUT_LOAD_ERROR: 'ERROR: Error loading layout. Check the layout file to make sure it exists.',
    NOT_READY_WARNING: 'WARNING: Not ready to perform action',
  };

  /**
   * Templating function that renders HTML templates.
   * @function
   * @param {string} text - HTML text to be evaluated.
   * @returns {string} Rendered template with injected data.
   */
  function Templater(text) {
    return new Function(
      'data',
      'var output=' +
      JSON.stringify(text)
        .replace(/<%=(.+?)%>/g, '"+($1)+"')
        .replace(/<%(.+?)%>/g, '";$1\noutput+="') +
      ';return output;'
    );
  }

  /**
   * Markdown renderer.
   * @function
   * @returns {string} Rendered markdown content as HTML.
   */
  function Markdown() {
    this.rules =  [
      {regex: /(#+)(.*)/g, replacement: header},                                       // headers - fix link anchor tag regex
      {regex: /!\[([^[]+)\]\(([^)]+)\)/g, replacement: '<img src=\'$2\' alt=\'$1\'>'}, // image
      {regex: /\[([^[]+)\]\(([^)]+)\)/g, replacement: '<a href=\'$2\'>$1</a>'},        // hyperlink
      {regex: /(\*\*|__)(.*?)\1/g, replacement: '<strong>$2</strong>'},                // bold
      {regex: /(\*|_)(.*?)\1/g, replacement: '<em>$2</em>'},                           // emphasis
      {regex: /~~(.*?)~~/g, replacement: '<del>$1</del>'},                             // del
      {regex: /:"(.*?)":/g, replacement: '<q>$1</q>'},                                 // quote
      {regex: /```[a-z]*\n[\s\S]*?\n```/g, replacement: blockCode},                    // block code
      {regex: /&&&[a-z]*\n[\s\S]*?\n&&&/g, replacement: jsCode},                       // js code - fix
      {regex: /`(.*?)`/g, replacement: '<code>$1</code>'},                             // inline code
      {regex: /\n\*(.*)/g, replacement: ulList},                                       // ul lists
      {regex: /\n[0-9]+\.(.*)/g, replacement: olList},                                 // ol lists
      {regex: /\n(&gt;|>)(.*)/g, replacement: blockquote},                             // blockquotes
      {regex: /\n-{5,}/g, replacement: '\n<hr />'},                                    // horizontal rule
      {regex: /\n([^\n]+)\n/g, replacement: para},                                     // add paragraphs
      {regex: /<\/ul>\s?<ul>/g, replacement: ''},                                      // fix extra ul
      {regex: /<\/ol>\s?<ol>/g, replacement: ''},                                      // fix extra ol
      {regex: /<\/blockquote><blockquote>/g, replacement: '\n'}                        // fix extra blockquote
    ];
    this.render = function (text) {
      text = '\n' + text + '\n';
      this.rules.forEach(function (rule) {
        text = text.replace(rule.regex, rule.replacement);
      });
      return text.trim();
    };
    function para (text, line) {
      var trimmed = line.trim();
      if (/^<\/?(ul|ol|li|h|p|bl)/i.test(trimmed)) {
        return '\n' + line + '\n';
      }
      return '\n<p>' + trimmed + '</p>\n';
    }
    function ulList (text, item) {
      return '\n<ul>\n\t<li>' + item.trim() + '</li>\n</ul>';
    }
    function olList (text, item) {
      return '\n<ol>\n\t<li>' + item.trim() + '</li>\n</ol>';
    }
    function blockquote (text, tmp, item) {
      return '\n<blockquote>' + item.trim() + '</blockquote>';
    }
    function jsCode (text) {
      text = text.replace(/```/gm, '');
      return '<script type="text/javascript">' + text.trim() + '</script>';
    }
    function blockCode (text) {
      text = text.replace(/```/gm, '');
      return '<pre>' + text.trim() + '</pre>';
    }
    function header (text, chars, content) {
      var level = chars.length;
      return '<h' + level + '>' + content.trim() + '</h' + level + '>';
    }
  }

  /**
   * AJAX Get utility function.
   * @function
   * @async
   * @param {string} url - URL of the request.
   * @param {function} callback - Callback after request is complete.
   */
  function get(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        if (req.status === 200) {
          callback(req.response, false);
        } else {
          callback(req, req.statusText);
        }
      }
    };
    req.send();
  }

  /**
   * Extend utility function for extending objects.
   * @function
   * @param {object} target - Target object to extend.
   * @param {object} opts - Options to extend.
   * @param {function} callback - Callback function after completion.
   * @returns {object} Extended target object.
   */
  function extend(target, opts, callback) {
    var next;
    if (typeof opts === 'undefined') {
      opts = target;
    }
    for (next in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, next)) {
        target[next] = opts[next];
      }
    }
    if (callback) {
      callback();
    }
    return target;
  }

  /**
   * Utility function for getting a function name.
   * @function
   * @param {function} func - The function to get the name
   * @returns {string} Name of function.
   */
  function getFunctionName(func) {
    var ret = func.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  }

  /**
   * Checks if the file URL with file extension is a valid file to load.
   * @function
   * @param {string} fileUrl - File URL
   * @returns {boolean} Is valid.
   */
  function isValidFile(fileUrl, extension) {
    var ext = fileUrl.split('.').pop();
    return (ext === extension.replace('.', '') || ext === 'html') ? true : false;
  }

  /**
   * Get URL paths without parameters.
   * @function
   * @returns {string} URL Path
   */
  function getPathsWithoutParameters() {
    return window.location.hash.split('/').map(function(path) {
      if (path.indexOf('?') >= 0) {
        path = path.substring(0, path.indexOf('?'));
      }
      return path;
    }).filter(function(path) { return path !== '#'; });
  }

  /**
   * Get URL parameter by name.
   * @function
   * @param {string} name - Name of parameter.
   * @param {string} url - URL
   * @returns {string} Parameter value
   */
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
   * Load template from URL.
   * @function
   * @async
   * @param {string} url - URL of template to load.
   * @param {object} data - Data to load into template.
   * @param {function} callback - Callback function
   */
  function loadTemplate(url, data, callback) {
    get(url, function(success, error) {
      if (error) callback(success, error);
      callback(Templater(success)(data), error);
    });
  }

  /**
   * Renders the layout into the main container.
   * @function renderLayout
   * @async
   * @param {string} layout - Filename of layout.
   * @param {object} data - Data passed to template.
   */
  function renderLayout(layout, data) {
    container.innerHTML = '';
    var url = [config.layoutDirectory, '/', layout, '.html'].join('');
    loadTemplate(url, data, function(success, error) {
      if (error) {
        handleMessage(msg['LAYOUT_LOAD_ERROR']);
      } else {
        container.innerHTML = success;
      }
    });
  }

  /**
   * Get Github URL based on configuration.
   * @function
   * @param {string} type - Type of file.
   * @returns {string} GIthub URL
   */
  function getGithubUrl(type, gh) {
    var url = [gh.host, 'repos', gh.username, gh.repo, 'contents',
      type + '?ref=' + config.github.branch];
    if (gh.prefix) url.splice(5, 0, gh.prefix);
    return url.join('/');
  }

  /**
   * Formats date string to d/m/yyyy.
   * @param {string} dateString - Date string to convert.
   * @returns {string} Formatted date string
   */
  function formatDate(dateString) {
    var date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return [date.getDate(),
      (date.getMonth() + 1),date.getFullYear()].join('/');
  }

  /**
   * Creates message container element
   * @function
   * @param {string} classname - Container classname.
   */
  function createMessageContainer(classname) {
    messageContainer = document.createElement('div');
    messageContainer.className = classname;
    messageContainer.innerHTML = 'DEBUG';
    messageContainer.style.background = 'yellow';
    messageContainer.style.position = 'absolute';
    messageContainer.style.top = '0px';
    document.body.appendChild(messageContainer);
  }

  /**
   * Handle messages
   * @function
   * @param {string} message - Message.
   * @returns {string} message
   * @description
   * Used for debugging purposes.
   */
  function handleMessage(message) {
    if (config.debug) messageContainer.innerHTML = message;
    return message;
  }

  /**
   * Represents a file collection.
   * @constructor
   * @param {string} type - The type of file collection (i.e. posts, pages).
   * @param {object} layout - The layouts of the file collection type.
   */
  var FileCollection = function(type, layout) {
    this.type = type;
    this.layout = layout;
    this.files = [];
    this[type] = this.files;
  };

  FileCollection.prototype = {

    /**
     * Initialize file collection.
     * @method
     * @async
     * @param {function} callback - Callback function
     */
    init: function(callback) {
      this.getFiles(function(success, error) {
        if (error) handleMessage(msg['DIRECTORY_ERROR']);
        this.loadFiles(function(success, error) {
          if (error) handleMessage(msg['GET_FILE_ERROR']);
          callback();
        }.bind(this));
      }.bind(this));
    },

    /**
     * Get file list URL.
     * @method
     * @param {string} type - Type of file collection.
     * @returns {string} URL of file list
     */
    getFileListUrl: function(type, config) {
      return (config.mode === 'GITHUB') ? getGithubUrl(type, config.github) : type;
    },

    /**
     * Get file URL.
     * @method
     * @param {object} file - File object.
     * @returns {string} File URL
     */
    getFileUrl: function(file, mode) {
      return (mode === 'GITHUB') ? file['download_url'] : file.getAttribute('href');
    },

    /**
     * Get file elements.
     * @param {object} data - File directory or Github data.
     * @returns {array} File elements
     */
    getFileElements: function(data) {
      var fileElements;

      // Github Mode
      if (config.mode === 'GITHUB') {
        fileElements = JSON.parse(data);
      }
      // Server Mode
      else {
        // convert the directory listing to a DOM element
        var listElement = document.createElement('div');
        listElement.innerHTML = data;
        // get the links in the directory listing
        fileElements = [].slice.call(listElement.getElementsByTagName('a'));
      }
      return fileElements;
    },

    /**
     * Get files from file listing and set to file collection.
     * @method
     * @async
     * @param {function} callback - Callback function
     */
    getFiles: function(callback) {
      get(this.getFileListUrl(this.type, config), function(success, error) {
        if (error) callback(success, error);
        // find the file elements that are valid files, exclude others
        this.getFileElements(success).forEach(function(file) {
          var fileUrl = this.getFileUrl(file, config.mode);
          if (isValidFile(fileUrl, config.extension)) {
            this.files.push(new File(fileUrl, this.type, this.layout.single));
          }
        }.bind(this));
        callback(success, error);
      }.bind(this));
    },

    /**
     * Load files and get file content.
     * @method
     * @async
     * @param {function} callback - Callback function
     */
    loadFiles: function(callback) {
      var promises = [];
      // Load file content
      this.files.forEach(function(file, i) {
        file.getContent(function(success, error) {
          if (error) callback(success, error);
          promises.push(i);
          file.parseContent();
          // Execute after all content is loaded
          if (this.files.length == promises.length) {
            callback(success, error);
          }
        }.bind(this));
      }.bind(this));
    },

    /**
     * Search file collection by attribute.
     * @method
     * @param {string} attribute - Attribue in file to search.
     * @param {string} search - Search query.
     * @returns {object} File object
     */
    search: function(attribute, search) {
      this[this.type] = this.files.filter(function(file) {
        var attr = file[attribute].toLowerCase().trim();
        return attr.indexOf(search.toLowerCase().trim()) >= 0;
      });
    },

    /**
     * Reset file collection files.
     * @method
     */
    resetSearch: function() {
      this[this.type] = this.files;
    },

    /**
     * Get files by tag.
     * @method
     * @param {string} query - Search query.
     * @returns {array} Files array
     */
    getByTag: function(query) {
      this[this.type] = this.files.filter(function(file) {
        if (query && file.tags) {
          return file.tags.some(function(tag) {
            return tag === query;
          });
        }
      });
    },

    /**
     * Get file by permalink.
     * @method
     * @param {string} permalink - Permalink to search.
     * @returns {object} File object.
     */
    getFileByPermalink: function(permalink) {
      return this.files.filter(function(file) {
        return file.permalink === permalink;
      })[0];
    },

    /**
     * Renders file collection.
     * @method
     * @async
     * @returns {string} Rendered layout
     */
    render: function() {
      return renderLayout(this.layout.list, this);
    },
  };


  /**
   * Represents a file.
   * @constructor
   * @param {string} url - The URL of the file.
   * @param {string} type - The type of file (i.e. posts, pages).
   * @param {object} layout - The layout templates of the file.
   */
  var File = function(url, type, layout) {
    this.url = url;
    this.type = type;
    this.layout = layout;
    this.html = false;
    this.content;
    this.name;
    this.extension;
    this.title;
    this.excerpt;
    this.date;
    this.datetime;
    this.author;
    this.body;
    this.permalink;
    this.tags;
  };

  File.prototype = {

    /**
    * Get file content.
    * @method
    * @async
    * @param {function} callback - Callback function.
    * @description
    * Get the file's HTML content and set the file object html
    * attribute to the file content.
    */
    getContent: function(callback) {
      get(this.url, function(success, error) {
        if (error) callback(success, error);
        this.content = success;
        // check if the response returns a string instead
        // of an response object
        if (typeof this.content === 'string') {
          callback(success, error);
        }
      }.bind(this));
    },

    /**
     * Parse front matter.
     * @method
     * @description
     * Overrides post attributes if front matter is available.
     */
    parseFrontMatter: function() {
      var yaml = this.content.split(config.frontMatterSeperator)[1];
      if (yaml) {
        var attributes = {};
        yaml.split(/\n/g).forEach(function(attributeStr) {
          var attribute = attributeStr.split(':');
          attribute[1] && (attributes[attribute[0].trim()] = attribute[1].trim());
        });
        extend(this, attributes, null);
      }
    },

    /**
     * Set list attributes.
     * @method
     * @description
     * Sets front matter attributes that are specified as list attributes to
     * an array by splitting the string by commas.
     */
    setListAttributes: function() {
      config.listAttributes.forEach(function(attribute) {
        if (this.hasOwnProperty(attribute) && this[attribute]) {
          this[attribute] = this[attribute].split(',').map(function(item) {
            return item.trim();
          });
        }
      }.bind(this));
    },

    /**
     * Sets filename.
     * @method
     */
    setFilename: function() {
      this.name = this.url.substr(this.url.lastIndexOf('/'))
        .replace('/', '')
        .replace(config.extension, '');
    },

    /**
     * Sets permalink.
     * @method
     */
    setPermalink: function() {
      this.permalink = ['#', this.type, this.name].join('/');
    },

    /**
     * Set file date.
     * @method
     * @description
     * Check if filename has date otherwise use the date
     * in the front matter.
     */
    setDate: function() {
      var dateRegEx = new RegExp(config.dateParser);
      if (this.date) {
        this.datetime = new Date(this.date);
        this.date = formatDate(this.date);
      } else if (dateRegEx.test(this.url)) {
        this.date = dateRegEx.exec(this.url);
        this.datetime = new Date(this.date);
        this.date = formatDate(this.date);
      }
    },

    /**
     * Set file body.
     * @method
     * @description
     * Sets the body of the file based on content after the front matter.
     */
    setBody: function() {
      var html = this.content
        .split(config.frontMatterSeperator)
        .splice(2)
        .join(config.frontMatterSeperator);
      if (this.html) {
        this.body = html;
      } else {
        if (config.markdownEngine) {
          this.body = config.markdownEngine(html);
        } else {
          var md = new Markdown();
          this.body = md.render(html);
        }
      }
    },

    /**
     * Parse file content.
     * @method
     * @description
     * Sets all file attributes and content.
     */
    parseContent: function() {
      this.setFilename();
      this.setPermalink();
      this.parseFrontMatter();
      this.setListAttributes();
      this.setDate();
      this.setBody();
    },

    /**
     * Renders file.
     * @method
     * @async
     */
    render: function() {
      return renderLayout(this.layout, this);
    },
  };


  /**
   * Sort method for file collections.
   * @method
   * @param {string} type - Type of file collection.
   * @param {function} sort - Sorting function.
   */
  this.sort = function(type, sort) {
    if (this.ready) {
      this.collections[type][type].sort(sort);
      this.collections[type].render();
    } else {
      handleMessage(msg['NOT_READY_WARNING']);
    }
  };

  /**
   * Search method for file collections.
   * @method
   * @param {string} type - Type of file collection.
   * @param {string} attribute - File attribute to search.
   * @param {string} search - Search query.
   */
  this.search = function(type, attribute, search) {
    if (this.ready) {
      this.collections[type].search(attribute, search);
      this.collections[type].render();
    } else {
      handleMessage(msg['NOT_READY_WARNING']);
    }
  };

  /**
   * Router
   * @method
   * @description
   * Sets up router for file collections to render collections
   * and files based on URL hash.
   */
  this.route = function() {
    var paths = getPathsWithoutParameters();
    var type = paths[0];
    var filename = paths[1];
    var collection = this.collections[type];

    var query = getParameterByName('query') || '';
    var tag = getParameterByName('tag') || '';

    this.routes[type] = function() {
      // Default view
      if (!type) {
        window.location = ['#', config.defaultView].join('/');
      }
      // List and single views
      else {
        if (filename) {
          // Single view
          var permalink = ['#', type, filename.trim()].join('/');
          collection.getFileByPermalink(permalink).render();
        } else if (collection) {
          // List view
          if (query) {
            // Check for queries
            collection.search('title', query);
          } else if (tag) {
            // Check for tags
            collection.getByTag(tag);
          } else {
            // Reset search
            collection.resetSearch();
          }
          collection.render();
        } else {
          // Error view
          renderLayout(config.errorLayout, {});
        }
      }
      // onroute event
      config.onroute();
    };
    return this.routes[type]();
  };


  /**
   * Register plugins.
   * @method
   * @description
   * Set up plugins based on user configuration.
   */
  this.registerPlugins = function() {
    config.plugins.forEach(function(plugin) {
      var name = getFunctionName(plugin);
      if (!this[name]) {
        this[name] = plugin;
      }
    }.bind(this));
  };

  /**
   * Initialize file collections
   * @method
   * @async
   */
  this.initFileCollections = function(callback) {
    var promises = [];
    var types = [];

    // setup collections and routes
    config.types.forEach(function(type) {
      this.collections[type.name] = new FileCollection(type.name, type.layout);
      types.push(type.name);
    }.bind(this));

    // init collections
    types.forEach(function(type, i) {
      this.collections[type].init(function() {
        promises.push(i);
        // reverse order to display newest posts first for post types
        if (type.indexOf('post') === 0) {
          this.collections[type][type].reverse();
        }
        // Execute after all content is loaded
        if (types.length == promises.length) {
          callback();
        }
      }.bind(this));
    }.bind(this));
  };

  /**
   * Init
   * @method
   * @description
   * Initializes the application based on the configuration. Sets up up config object,
   * hash change event listener for router, and loads the content.
   */
  this.init = function() {
    // set config
    config = Object.assign({}, defaults, config);

    // create message container element if debug mode is enabled
    if (config.debug) {
      createMessageContainer(config.messageClassName);
    }

    // check for hash changes
    window.addEventListener('hashchange', this.route.bind(this));

    if (config.elementId) {
      // setup container
      container = document.getElementById(config.elementId);

      if (container) {
        // setup file collections
        this.initFileCollections(function() {
          // start router by manually triggering hash change
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          // register plugins and run onload events
          this.ready = true;
          this.registerPlugins();
          config.onload();
        }.bind(this));
      } else {
        handleMessage(msg['ELEMENT_ID_ERROR']);
      }
    } else {
      handleMessage(msg['ELEMENT_ID_ERROR']);
    }
  };

  // Initialize
  this.init();
};