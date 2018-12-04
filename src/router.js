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

export default router;