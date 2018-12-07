import defaults from './defaults';
import { messages as msg, createMessageContainer, handleMessage } from './messages';
import { getFunctionName,
  getParameterByName,
  getPathsWithoutParameters,
  renderLayout } from './utils';
import FileCollection from './filecollection';


let ready = false;
const routes = {};
const collections = {};
const filteredCollections = {};
let config;


function Instance (options) {

  /**
   * Register plugins.
   * @method
   * @description
   * Set up plugins based on user configuration.
   */
  function registerPlugins(config) {
    config.plugins.forEach(function(plugin) {
      var name = getFunctionName(plugin);
      if (!this[name]) {
        this[name] = plugin;
      }
    });
  }

  /**
   * Router
   * @method
   * @description
   * Sets up router for file collections to render collections
   * and files based on URL hash.
   */
  function router() {
    var paths = getPathsWithoutParameters();

    var type = paths[0];
    var filename = paths[1];
    var collection = collections[type];

    var query = getParameterByName('query') || '';
    var tag = getParameterByName('tag') || '';

    routes[type] = function() {
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
          renderLayout(config.errorLayout, config, {});
        }
      }
      // onroute event
      config.onroute();
    };
    return routes[type]();
  };

  /**
   * Initialize file collections
   * @method
   * @async
   */
  function initFileCollections(config, callback) {
    var promises = [];
    var types = [];

    // setup collections and routes
    config.types.forEach((type) => {
      collections[type.name] = new FileCollection(type.name, type.layout, config);
      types.push(type.name);
    });

    // init collections
    types.forEach((type, i) => {
      collections[type].init(() => {
        promises.push(i);
        // reverse order to display newest posts first for post types
        if (type.indexOf('post') === 0) {
          collections[type][type].reverse();
        }
        // Execute after all content is loaded
        if (types.length == promises.length) {
          callback();
        }
      });
    });
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
    config = Object.assign({}, defaults, options);

    // create message container element if debug mode is enabled
    if (config.debug) {
      createMessageContainer(config.messageClassName);
    }

    if (config.elementId) {
      // setup container
      config.container = document.getElementById(config.elementId);

      // check for hash changes
      window.addEventListener('hashchange', router);

      if (config.container) {
        // setup file collections
        initFileCollections(config, () => {
          // start router by manually triggering hash change
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          // register plugins and run onload events
          ready = true;
          // TODO: registerPlugins();
          config.onload();
        });
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
