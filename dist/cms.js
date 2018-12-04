
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var CMS = (function () {
  'use strict';

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
    onload: function onload() {},
    onroute: function onroute() {}
  };

  var messages = {
    NO_FILES_ERROR: 'ERROR: No files in directory',
    ELEMENT_ID_ERROR: 'ERROR: No element ID or ID incorrect. Check "elementId" parameter in config.',
    DIRECTORY_ERROR: 'ERROR: Error getting files. Make sure there is a directory for each type in config with files in it.',
    GET_FILE_ERROR: 'ERROR: Error getting the file',
    LAYOUT_LOAD_ERROR: 'ERROR: Error loading layout. Check the layout file to make sure it exists.',
    NOT_READY_WARNING: 'WARNING: Not ready to perform action'
  };

  /**
   * Templating function that renders HTML templates.
   * @function
   * @param {string} text - HTML text to be evaluated.
   * @returns {string} Rendered template with injected data.
   */
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
   * CMS.js v2.0.0
   * Copyright 2018 Chris Diana
   * https://chrisdiana.github.io/cms.js
   * Free to use under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   */
  var container$1;
  var ready = false;
  var routes = {};
  var collections = {};
  var filteredCollections = {};

  function router() {}

  function Instance(config) {
    /**
     * Register plugins.
     * @method
     * @description
     * Set up plugins based on user configuration.
     */
    function registerPlugins() {
      config.plugins.forEach(function (plugin) {
        var name = getFunctionName(plugin);

        if (!this[name]) {
          this[name] = plugin;
        }
      }.bind(this));
    }
    /**
     * Init
     * @method
     * @description
     * Initializes the application based on the configuration. Sets up up config object,
     * hash change event listener for router, and loads the content.
     */

    function init() {
      // set config
      config = Object.assign({}, defaults, config); // create message container element if debug mode is enabled

      if (config.debug) {
        createMessageContainer(config.messageClassName);
      } // check for hash changes


      window.addEventListener('hashchange', router);

      if (config.elementId) {
        // setup container
        container$1 = document.getElementById(config.elementId);

        if (container$1) {
          // setup file collections
          // this.initFileCollections(function() {
          // start router by manually triggering hash change
          window.dispatchEvent(new HashChangeEvent('hashchange')); // register plugins and run onload events

          ready = true;
          registerPlugins();
          config.onload(); // }.bind(this));
        } else {
          handleMessage(config.debug, messages['ELEMENT_ID_ERROR']);
        }
      } else {
        handleMessage(config.debug, messages['ELEMENT_ID_ERROR']);
      }
    } // Initialize


    init();
    return {
      ready: ready,
      routes: routes,
      collections: collections,
      filteredCollections: filteredCollections,

      /**
       * Sort method for file collections.
       * @method
       * @param {string} type - Type of file collection.
       * @param {function} sort - Sorting function.
       */
      sort: function sort(type, _sort) {
        if (this.ready) {
          this.collections[type][type].sort(_sort);
          this.collections[type].render();
        } else {
          handleMessage(messages['NOT_READY_WARNING']);
        }
      },

      /**
       * Search method for file collections.
       * @method
       * @param {string} type - Type of file collection.
       * @param {string} attribute - File attribute to search.
       * @param {string} search - Search query.
       */
      search: function search(type, attribute, _search) {
        if (this.ready) {
          this.collections[type].search(attribute, _search);
          this.collections[type].render();
        } else {
          handleMessage(messages['NOT_READY_WARNING']);
        }
      }
    };
  }

  return Instance;

}());
