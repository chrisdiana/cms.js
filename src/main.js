/**
 * CMS.js v2.0.0
 * Copyright 2018 Chris Diana
 * https://chrisdiana.github.io/cms.js
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
// 'use strict';

import defaults from './defaults';
import msg from './messages';
import { createMessageContainer, handleMessage } from './utils';

let container;
let messageContainer;

let ready = false;
const routes = {};
const collections = {};
const filteredCollections = {};

function router() {}

function Instance (config) {

  /**
   * Register plugins.
   * @method
   * @description
   * Set up plugins based on user configuration.
   */
  function registerPlugins() {
    config.plugins.forEach(function(plugin) {
      var name = getFunctionName(plugin);
      if (!this[name]) {
        this[name] = plugin;
      }
    }.bind(this));
  }

  /**
   * Initialize file collections
   * @method
   * @async
   */
  function initFileCollections(callback) {
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
  function init() {
    // set config
    config = Object.assign({}, defaults, config);

    // create message container element if debug mode is enabled
    if (config.debug) {
      createMessageContainer(config.messageClassName);
    }

    // check for hash changes
    window.addEventListener('hashchange', router);

    if (config.elementId) {
      // setup container
      container = document.getElementById(config.elementId);

      if (container) {
        // setup file collections
        // this.initFileCollections(function() {
          // start router by manually triggering hash change
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          // register plugins and run onload events
          ready = true;
          registerPlugins();
          config.onload();
        // }.bind(this));
      } else {
        handleMessage(config.debug, msg['ELEMENT_ID_ERROR']);
      }
    } else {
      handleMessage(config.debug, msg['ELEMENT_ID_ERROR']);
    }
  }

  // Initialize
  init();

  return  {

    ready,
    routes,
    collections,
    filteredCollections,

    /**
     * Sort method for file collections.
     * @method
     * @param {string} type - Type of file collection.
     * @param {function} sort - Sorting function.
     */
    sort(type, sort) {
      if (this.ready) {
        this.collections[type][type].sort(sort);
        this.collections[type].render();
      } else {
        handleMessage(msg['NOT_READY_WARNING']);
      }
    },

    /**
     * Search method for file collections.
     * @method
     * @param {string} type - Type of file collection.
     * @param {string} attribute - File attribute to search.
     * @param {string} search - Search query.
     */
    search(type, attribute, search) {
      if (this.ready) {
        this.collections[type].search(attribute, search);
        this.collections[type].render();
      } else {
        handleMessage(msg['NOT_READY_WARNING']);
      }
    },

  }

}


export default Instance;
