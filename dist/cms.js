/*! CMS.js v2.0.0 | MIT (c) 2018 Chris Diana | https://github.com/chrisdiana/cms.js */
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var CMS = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var defaults = {
    elementId: null,
    layoutDirectory: null,
    defaultView: null,
    errorLayout: null,
    mode: 'SERVER',
    github: null,
    types: [],
    plugins: [],
    frontMatterSeperator: /^---$/m,
    listAttributes: ['tags'],
    dateParser: /\d{4}-\d{2}(?:-\d{2})?/,
    dateFormat: function dateFormat(date) {
      return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/');
    },
    extension: '.md',
    sort: undefined,
    markdownEngine: null,
    debug: false,
    messageClassName: 'cms-messages',
    onload: function onload() {},
    onroute: function onroute() {}
  };

  var messageContainer;
  var messages = {
    NO_FILES_ERROR: 'ERROR: No files in directory',
    ELEMENT_ID_ERROR: 'ERROR: No element ID or ID incorrect. Check "elementId" parameter in config.',
    DIRECTORY_ERROR: 'ERROR: Error getting files. Make sure there is a directory for each type in config with files in it.',
    GET_FILE_ERROR: 'ERROR: Error getting the file',
    LAYOUT_LOAD_ERROR: 'ERROR: Error loading layout. Check the layout file to make sure it exists.',
    NOT_READY_WARNING: 'WARNING: Not ready to perform action'
  };
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


  function handleMessage(debug, message) {
    if (debug) messageContainer.innerHTML = message;
    return message;
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

    req.onreadystatechange = function () {
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
    if (fileUrl) {
      var ext = fileUrl.split('.').pop();
      return ext === extension.replace('.', '') || ext === 'html' ? true : false;
    }
  }
  /**
   * Get URL paths without parameters.
   * @function
   * @returns {string} URL Path
   */

  function getPathsWithoutParameters() {
    return window.location.hash.split('/').map(function (path) {
      if (path.indexOf('?') >= 0) {
        path = path.substring(0, path.indexOf('?'));
      }

      return path;
    }).filter(function (path) {
      return path !== '#';
    });
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
   * Get Github URL based on configuration.
   * @function
   * @param {string} type - Type of file.
   * @returns {string} GIthub URL
   */

  function getGithubUrl(type, gh) {
    var url = [gh.host, 'repos', gh.username, gh.repo, 'contents', type + '?ref=' + gh.branch];
    if (gh.prefix) url.splice(5, 0, gh.prefix);
    return url.join('/');
  }
  /**
   * Formats date string to datetime
   * @param {string} dateString - Date string to convert.
   * @returns {object} Formatted datetime
   */

  function getDatetime(dateStr) {
    var dt = new Date(dateStr);
    return new Date(dt.getTime() - dt.getTimezoneOffset() * -60000);
  }

  /**
   * Templating function that renders HTML templates.
   * @function
   * @param {string} text - HTML text to be evaluated.
   * @returns {string} Rendered template with injected data.
   */

  function Templater(text) {
    return new Function('data', 'var output=' + JSON.stringify(text).replace(/<%=(.+?)%>/g, '"+($1)+"').replace(/<%(.+?)%>/g, '";$1\noutput+="') + ';return output;');
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
    get(url, function (success, error) {
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

  function renderLayout(layout, config, data) {
    config.container.innerHTML = '';
    var url = [config.layoutDirectory, '/', layout, '.html'].join('');
    loadTemplate(url, data, function (success, error) {
      if (error) {
        handleMessage(messages['LAYOUT_LOAD_ERROR']);
      } else {
        config.container.innerHTML = success;
      }
    });
  }

  /**
   * Markdown renderer.
   * @thanks renehamburger/slimdown.js
   * @function
   * @returns {string} Rendered markdown content as HTML.
   */
  var Markdown =
  /*#__PURE__*/
  function () {
    function Markdown() {
      _classCallCheck(this, Markdown);

      this.rules = [// headers - fix link anchor tag regex
      {
        regex: /(#+)(.*)/g,
        replacement: function replacement(text, chars, content) {
          var level = chars.length;
          return '<h' + level + '>' + content.trim() + '</h' + level + '>';
        }
      }, // image
      {
        regex: /!\[([^[]+)\]\(([^)]+)\)/g,
        replacement: '<img src=\'$2\' alt=\'$1\'>'
      }, // hyperlink
      {
        regex: /\[([^[]+)\]\(([^)]+)\)/g,
        replacement: '<a href=\'$2\'>$1</a>'
      }, // bold
      {
        regex: /(\*\*|__)(.*?)\1/g,
        replacement: '<strong>$2</strong>'
      }, // emphasis
      {
        regex: /(\*|_)(.*?)\1/g,
        replacement: '<em>$2</em>'
      }, // del
      {
        regex: /~~(.*?)~~/g,
        replacement: '<del>$1</del>'
      }, // quote
      {
        regex: /:"(.*?)":/g,
        replacement: '<q>$1</q>'
      }, // block code
      {
        regex: /```[a-z]*\n[\s\S]*?\n```/g,
        replacement: function replacement(text) {
          text = text.replace(/```/gm, '');
          return '<pre>' + text.trim() + '</pre>';
        }
      }, // js code
      {
        regex: /&&&[a-z]*\n[\s\S]*?\n&&&/g,
        replacement: function replacement(text) {
          text = text.replace(/```/gm, '');
          return '<script type="text/javascript">' + text.trim() + '</script>';
        }
      }, // inline code
      {
        regex: /`(.*?)`/g,
        replacement: '<code>$1</code>'
      }, // ul lists
      {
        regex: /\n\*(.*)/g,
        replacement: function replacement(text, item) {
          return '\n<ul>\n\t<li>' + item.trim() + '</li>\n</ul>';
        }
      }, // ol lists
      {
        regex: /\n[0-9]+\.(.*)/g,
        replacement: function replacement(text, item) {
          return '\n<ol>\n\t<li>' + item.trim() + '</li>\n</ol>';
        }
      }, // blockquotes
      {
        regex: /\n(&gt;|>)(.*)/g,
        replacement: function replacement(text, tmp, item) {
          return '\n<blockquote>' + item.trim() + '</blockquote>';
        }
      }, // horizontal rule
      {
        regex: /\n-{5,}/g,
        replacement: '\n<hr />'
      }, // add paragraphs
      {
        regex: /\n([^\n]+)\n/g,
        replacement: function replacement(text, line) {
          var trimmed = line.trim();

          if (/^<\/?(ul|ol|li|h|p|bl)/i.test(trimmed)) {
            return '\n' + line + '\n';
          }

          return '\n<p>' + trimmed + '</p>\n';
        }
      }, // fix extra ul
      {
        regex: /<\/ul>\s?<ul>/g,
        replacement: ''
      }, // fix extra ol
      {
        regex: /<\/ol>\s?<ol>/g,
        replacement: ''
      }, // fix extra blockquote
      {
        regex: /<\/blockquote><blockquote>/g,
        replacement: '\n'
      }];
    }

    _createClass(Markdown, [{
      key: "render",
      value: function render(text) {
        text = '\n' + text + '\n';
        this.rules.forEach(function (rule) {
          text = text.replace(rule.regex, rule.replacement);
        });
        return text.trim();
      }
    }]);

    return Markdown;
  }();

  /**
   * Represents a file.
   * @constructor
   * @param {string} url - The URL of the file.
   * @param {string} type - The type of file (i.e. posts, pages).
   * @param {object} layout - The layout templates of the file.
   */

  var File =
  /*#__PURE__*/
  function () {
    function File(url, type, layout, config) {
      _classCallCheck(this, File);

      this.url = url;
      this.type = type;
      this.layout = layout;
      this.config = config;
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
    }
    /**
    * Get file content.
    * @method
    * @async
    * @param {function} callback - Callback function.
    * @description
    * Get the file's HTML content and set the file object html
    * attribute to the file content.
    */


    _createClass(File, [{
      key: "getContent",
      value: function getContent(callback) {
        var _this = this;

        get(this.url, function (success, error) {
          if (error) callback(success, error);
          _this.content = success; // check if the response returns a string instead
          // of an response object

          if (typeof _this.content === 'string') {
            callback(success, error);
          }
        });
      }
      /**
       * Parse front matter.
       * @method
       * @description
       * Overrides post attributes if front matter is available.
       */

    }, {
      key: "parseFrontMatter",
      value: function parseFrontMatter() {
        var yaml = this.content.split(this.config.frontMatterSeperator)[1];

        if (yaml) {
          var attributes = {};
          yaml.split(/\n/g).forEach(function (attributeStr) {
            var attribute = attributeStr.split(':');
            attribute[1] && (attributes[attribute[0].trim()] = attribute[1].trim());
          });
          extend(this, attributes, null);
        }
      }
      /**
       * Set list attributes.
       * @method
       * @description
       * Sets front matter attributes that are specified as list attributes to
       * an array by splitting the string by commas.
       */

    }, {
      key: "setListAttributes",
      value: function setListAttributes() {
        var _this2 = this;

        this.config.listAttributes.forEach(function (attribute) {
          if (_this2.hasOwnProperty(attribute) && _this2[attribute]) {
            _this2[attribute] = _this2[attribute].split(',').map(function (item) {
              return item.trim();
            });
          }
        });
      }
      /**
       * Sets filename.
       * @method
       */

    }, {
      key: "setFilename",
      value: function setFilename() {
        this.name = this.url.substr(this.url.lastIndexOf('/')).replace('/', '').replace(this.config.extension, '');
      }
      /**
       * Sets permalink.
       * @method
       */

    }, {
      key: "setPermalink",
      value: function setPermalink() {
        this.permalink = ['#', this.type, this.name].join('/');
      }
      /**
       * Set file date.
       * @method
       * @description
       * Check if file has date in front matter otherwise use the date
       * in the filename.
       */

    }, {
      key: "setDate",
      value: function setDate() {
        var dateRegEx = new RegExp(this.config.dateParser);

        if (this.date) {
          this.datetime = getDatetime(this.date);
          this.date = this.config.dateFormat(this.datetime);
        } else if (dateRegEx.test(this.url)) {
          this.date = dateRegEx.exec(this.url);
          this.datetime = getDatetime(this.date);
          this.date = this.config.dateFormat(this.datetime);
        }
      }
      /**
       * Set file body.
       * @method
       * @description
       * Sets the body of the file based on content after the front matter.
       */

    }, {
      key: "setBody",
      value: function setBody() {
        var html = this.content.split(this.config.frontMatterSeperator).splice(2).join(this.config.frontMatterSeperator);

        if (this.html) {
          this.body = html;
        } else {
          if (this.config.markdownEngine) {
            this.body = this.config.markdownEngine(html);
          } else {
            var md = new Markdown();
            this.body = md.render(html);
          }
        }
      }
      /**
       * Parse file content.
       * @method
       * @description
       * Sets all file attributes and content.
       */

    }, {
      key: "parseContent",
      value: function parseContent() {
        this.setFilename();
        this.setPermalink();
        this.parseFrontMatter();
        this.setListAttributes();
        this.setDate();
        this.setBody();
      }
      /**
       * Renders file.
       * @method
       * @async
       */

    }, {
      key: "render",
      value: function render() {
        return renderLayout(this.layout, this.config, this);
      }
    }]);

    return File;
  }();

  /**
   * Represents a file collection.
   * @constructor
   * @param {string} type - The type of file collection (i.e. posts, pages).
   * @param {object} layout - The layouts of the file collection type.
   */

  var FileCollection =
  /*#__PURE__*/
  function () {
    function FileCollection(type, layout, config) {
      _classCallCheck(this, FileCollection);

      this.type = type;
      this.layout = layout;
      this.config = config;
      this.files = [];
      this[type] = this.files;
    }
    /**
     * Initialize file collection.
     * @method
     * @async
     * @param {function} callback - Callback function
     */


    _createClass(FileCollection, [{
      key: "init",
      value: function init(callback) {
        var _this = this;

        this.getFiles(function (success, error) {
          if (error) handleMessage(messages['DIRECTORY_ERROR']);

          _this.loadFiles(function (success, error) {
            if (error) handleMessage(messages['GET_FILE_ERROR']);
            callback();
          });
        });
      }
      /**
       * Get file list URL.
       * @method
       * @param {string} type - Type of file collection.
       * @returns {string} URL of file list
       */

    }, {
      key: "getFileListUrl",
      value: function getFileListUrl(type, config) {
        return config.mode === 'GITHUB' ? getGithubUrl(type, config.github) : type;
      }
      /**
       * Get file URL.
       * @method
       * @param {object} file - File object.
       * @returns {string} File URL
       */

    }, {
      key: "getFileUrl",
      value: function getFileUrl(file, mode) {
        return mode === 'GITHUB' ? file['download_url'] : file.getAttribute('href');
      }
      /**
       * Get file elements.
       * @param {object} data - File directory or Github data.
       * @returns {array} File elements
       */

    }, {
      key: "getFileElements",
      value: function getFileElements(data) {
        var fileElements; // Github Mode

        if (this.config.mode === 'GITHUB') {
          fileElements = JSON.parse(data);
        } // Server Mode
        else {
            // convert the directory listing to a DOM element
            var listElement = document.createElement('div');
            listElement.innerHTML = data; // get the links in the directory listing

            fileElements = [].slice.call(listElement.getElementsByTagName('a'));
          }

        return fileElements;
      }
      /**
       * Get files from file listing and set to file collection.
       * @method
       * @async
       * @param {function} callback - Callback function
       */

    }, {
      key: "getFiles",
      value: function getFiles(callback) {
        var _this2 = this;

        get(this.getFileListUrl(this.type, this.config), function (success, error) {
          if (error) callback(success, error); // find the file elements that are valid files, exclude others

          _this2.getFileElements(success).forEach(function (file) {
            var fileUrl = _this2.getFileUrl(file, _this2.config.mode);

            if (isValidFile(fileUrl, _this2.config.extension)) {
              _this2.files.push(new File(fileUrl, _this2.type, _this2.layout.single, _this2.config));
            }
          });

          callback(success, error);
        });
      }
      /**
       * Load files and get file content.
       * @method
       * @async
       * @param {function} callback - Callback function
       */

    }, {
      key: "loadFiles",
      value: function loadFiles(callback) {
        var _this3 = this;

        var promises = []; // Load file content

        this.files.forEach(function (file, i) {
          file.getContent(function (success, error) {
            if (error) callback(success, error);
            promises.push(i);
            file.parseContent(); // Execute after all content is loaded

            if (_this3.files.length == promises.length) {
              callback(success, error);
            }
          });
        });
      }
      /**
       * Search file collection by attribute.
       * @method
       * @param {string} attribute - Attribue in file to search.
       * @param {string} search - Search query.
       * @returns {object} File object
       */

    }, {
      key: "search",
      value: function search(attribute, _search) {
        this[this.type] = this.files.filter(function (file) {
          var attr = file[attribute].toLowerCase().trim();
          return attr.indexOf(_search.toLowerCase().trim()) >= 0;
        });
      }
      /**
       * Reset file collection files.
       * @method
       */

    }, {
      key: "resetSearch",
      value: function resetSearch() {
        this[this.type] = this.files;
      }
      /**
       * Get files by tag.
       * @method
       * @param {string} query - Search query.
       * @returns {array} Files array
       */

    }, {
      key: "getByTag",
      value: function getByTag(query) {
        this[this.type] = this.files.filter(function (file) {
          if (query && file.tags) {
            return file.tags.some(function (tag) {
              return tag === query;
            });
          }
        });
      }
      /**
       * Get file by permalink.
       * @method
       * @param {string} permalink - Permalink to search.
       * @returns {object} File object.
       */

    }, {
      key: "getFileByPermalink",
      value: function getFileByPermalink(permalink) {
        return this.files.filter(function (file) {
          return file.permalink === permalink;
        })[0];
      }
      /**
       * Renders file collection.
       * @method
       * @async
       * @returns {string} Rendered layout
       */

    }, {
      key: "render",
      value: function render() {
        return renderLayout(this.layout.list, this.config, this);
      }
    }]);

    return FileCollection;
  }();

  /**
   * Represents a CMS instance
   * @constructor
   * @param {object} options - Configuration options.
   */

  var CMS =
  /*#__PURE__*/
  function () {
    function CMS(view, options) {
      _classCallCheck(this, CMS);

      this.ready = false;
      this.collections = {};
      this.filteredCollections = {};
      this.state;
      this.view = view;
      this.config = Object.assign({}, defaults, options);
      this.init();
    }
    /**
     * Init
     * @method
     * @description
     * Initializes the application based on the configuration. Sets up up config object,
     * hash change event listener for router, and loads the content.
     */


    _createClass(CMS, [{
      key: "init",
      value: function init() {
        var _this = this;

        // create message container element if debug mode is enabled
        if (this.config.debug) {
          createMessageContainer(this.config.messageClassName);
        }

        if (this.config.elementId) {
          // setup container
          this.config.container = document.getElementById(this.config.elementId);

          if (this.config.container) {
            // setup file collections
            this.initFileCollections(function () {
              // check for hash changes
              _this.view.addEventListener('hashchange', _this.route.bind(_this), false); // start router by manually triggering hash change


              _this.view.dispatchEvent(new HashChangeEvent('hashchange')); // register plugins and run onload events


              _this.ready = true;

              _this.registerPlugins();

              _this.config.onload();
            });
          } else {
            handleMessage(this.config.debug, messages['ELEMENT_ID_ERROR']);
          }
        } else {
          handleMessage(this.config.debug, messages['ELEMENT_ID_ERROR']);
        }
      }
      /**
       * Initialize file collections
       * @method
       * @async
       */

    }, {
      key: "initFileCollections",
      value: function initFileCollections(callback) {
        var _this2 = this;

        var promises = [];
        var types = []; // setup collections and routes

        this.config.types.forEach(function (type) {
          _this2.collections[type.name] = new FileCollection(type.name, type.layout, _this2.config);
          types.push(type.name);
        }); // init collections

        types.forEach(function (type, i) {
          _this2.collections[type].init(function () {
            promises.push(i); // reverse order to display newest posts first for post types

            if (type.indexOf('post') === 0) {
              _this2.collections[type][type].reverse();
            } // Execute after all content is loaded


            if (types.length == promises.length) {
              callback();
            }
          });
        });
      }
    }, {
      key: "route",
      value: function route() {
        var paths = getPathsWithoutParameters();
        var type = paths[0];
        var filename = paths[1];
        var collection = this.collections[type];
        var query = getParameterByName('query') || '';
        var tag = getParameterByName('tag') || '';
        this.state = window.location.hash.substr(1); // Default view

        if (!type) {
          window.location = ['#', this.config.defaultView].join('/');
        } // List and single views
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
              renderLayout(this.config.errorLayout, this.config, {});
            }
          } // onroute event


        this.config.onroute();
      }
      /**
       * Register plugins.
       * @method
       * @description
       * Set up plugins based on user configuration.
       */

    }, {
      key: "registerPlugins",
      value: function registerPlugins() {
        var _this3 = this;

        this.config.plugins.forEach(function (plugin) {
          var name = getFunctionName(plugin);

          if (!_this3[name]) {
            _this3[name] = plugin;
          }
        });
      }
      /**
        * Sort method for file collections.
        * @method
        * @param {string} type - Type of file collection.
        * @param {function} sort - Sorting function.
        */

    }, {
      key: "sort",
      value: function sort(type, _sort) {
        if (this.ready) {
          this.collections[type][type].sort(_sort);
          this.collections[type].render();
        } else {
          handleMessage(messages['NOT_READY_WARNING']);
        }
      }
      /**
        * Search method for file collections.
        * @method
        * @param {string} type - Type of file collection.
        * @param {string} attribute - File attribute to search.
        * @param {string} search - Search query.
        */

    }, {
      key: "search",
      value: function search(type, attribute, _search) {
        if (this.ready) {
          this.collections[type].search(attribute, _search);
          this.collections[type].render();
        } else {
          handleMessage(messages['NOT_READY_WARNING']);
        }
      }
    }]);

    return CMS;
  }();

  /**
   * CMS.js v2.0.0
   * Copyright 2018 Chris Diana
   * https://chrisdiana.github.io/cms.js
   * Free to use under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   */
  var main = (function (options) {
    return new CMS(window, options);
  });

  return main;

}());
