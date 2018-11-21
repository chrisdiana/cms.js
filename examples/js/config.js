// Config
var config = {

  // ID of element to attach CMS.js to
  elementId: 'cms',

  // Mode 'GITHUB' for Github Pages, 'SERVER' for Self Hosted
  // Defaults to Server mode if not specified
  mode: 'SERVER',

  // If Github mode is set, your Github username, repo name, 
  // and branch to get files from.
  github: {
    username: 'yourusername',
    repo: 'yourrepo',
    branch: 'gh-pages',
    host: 'https://api.github.com',
    // Use prefix option if your site is located in a subdirectory.
    // prefix: 'subdirectory',
  },

  // The name of the layouts directory.
  layoutDirectory: 'layouts',

  // The error layout template name.
  errorLayout: 'error',

  // The URL that will be the default view that will initially load
  // For example, this could a list view or a could be a specific view
  // like a single page.
  defaultView: 'posts',

  // These are the types of content to load. Each type name is a directory or
  // folder where the files, pages or posts are located. Each type has a list
  // and single layout template that will determine how the file will be rendered.
  types: [
    {
    // for example, layouts/post-list.html
    name: 'posts',
      layout: { list: 'post-list', single: 'post' },
    },
    {
      name: 'pages',
      layout: { list: 'page-list', single: 'page' },
    },
  ],
};

// Initialize CMS.js
var blog = new CMS(config);