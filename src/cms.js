import defaults from './defaults';
import FileCollection from './filecollection';
import { messages as msg, createMessageContainer, handleMessage } from './messages';
import { getFunctionName, getParameterByName, getPathsWithoutParameters } from './utils';
import { renderLayout } from './templater';

/**
 * Represents a CMS instance
 * @constructor
 * @param {object} options - Configuration options.
 */
class CMS {

  constructor(view, options) {
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
  init() {
    // create message container element if debug mode is enabled
    if (this.config.debug) {
      createMessageContainer(this.config.messageClassName);
    }
    if (this.config.elementId) {
      // setup container
      this.config.container = document.getElementById(this.config.elementId);

      if (this.config.container) {
        // setup file collections
        this.initFileCollections(() => {
          // check for hash changes
          this.view.addEventListener('hashchange', this.route.bind(this), false);
          // start router by manually triggering hash change
          this.view.dispatchEvent(new HashChangeEvent('hashchange'));
          // register plugins and run onload events
          this.ready = true;
          this.registerPlugins();
          this.config.onload();
        });
      } else {
        handleMessage(this.config.debug, msg['ELEMENT_ID_ERROR']);
      }
    } else {
      handleMessage(this.config.debug, msg['ELEMENT_ID_ERROR']);
    }
  }

  /**
   * Initialize file collections
   * @method
   * @async
   */
  initFileCollections(callback) {
    var promises = [];
    var types = [];

    // setup collections and routes
    this.config.types.forEach((type) => {
      this.collections[type.name] = new FileCollection(type.name, type.layout, this.config);
      types.push(type.name);
    });

    // init collections
    types.forEach((type, i) => {
      this.collections[type].init(() => {
        promises.push(i);
        // reverse order to display newest posts first for post types
        if (type.indexOf('post') === 0) {
          this.collections[type][type].reverse();
        }
        // Execute after all content is loaded
        if (types.length == promises.length) {
          callback();
        }
      });
    });
  }

  route() {
    const paths = getPathsWithoutParameters();
    const type = paths[0];
    const filename = paths[1];
    const collection = this.collections[type];

    const query = getParameterByName('query') || '';
    const tag = getParameterByName('tag') || '';

    this.state = window.location.hash.substr(1);

    // Default view
    if (!type) {
      window.location = ['#', this.config.defaultView].join('/');
    }
    // List and single views
    else {
      if (filename) {
        // Single view
        const permalink = ['#', type, filename.trim()].join('/');
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
    }
    // onroute event
    this.config.onroute();
  }

  /**
   * Register plugins.
   * @method
   * @description
   * Set up plugins based on user configuration.
   */
  registerPlugins() {
    this.config.plugins.forEach((plugin) => {
      const name = getFunctionName(plugin);
      if (!this[name]) {
        this[name] = plugin;
      }
    });
  }

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
  }

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
  }

}

export default CMS;
