$(function() {

  CMS.init({

    // Name of your site or location of logo file, relative to root directory (img/logo.png)
    siteName: 'My Site',

    // Tagline for your site
    siteTagline: 'Your site tagline',

    // Email address
    siteEmail: 'your_email@example.com',

    // Name
    siteAuthor: 'Your Name',

    // Navigation items
    siteNavItems: [
      { name: 'Github', href: 'https://github.com/yourname', newWindow: false},
      { name: 'Another Page'},
      { name: 'About'}
    ],

    // Posts folder name
    postsFolder: 'posts',

    // Homepage posts snippet length (this doesn't appear to do anything)
    postSnippetLength: 120,

    // Homepage post preview cuttoff (string or regex, defaults to <!--more-->)
    postSnippetSeparator: /\s*<!--\s*more\s*-->/,

    // Pages folder name
    pagesFolder: 'pages',

    // Order of sorting (true for newest to oldest)
    sortDateOrder: true,

    // Posts on Frontpage (blog style)
    postsOnFrontpage: true,

    // Page as Frontpage (static)
    pageAsFrontpage: '',

    // Posts/Blog on different URL
    postsOnUrl: '',

    // Site fade speed
    fadeSpeed: 300,

    // Site footer text
    footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',

    // Mode 'Github' for Github Pages, 'Server' for Self Hosted. Defaults
    // to Github
    mode: 'Apache',

     // If Github mode is set, your Github username and repo name.
    githubUserSettings: {
      username: 'yourusername',
      repo: 'yourrepo'
    },

    // If Github mode is set, choose which Github branch to get files from.
    // Defaults to Github pages branch (gh-pages)
    githubSettings: {
      branch: 'gh-pages',
      host: 'https://api.github.com'
    },

    // To have comments, set up an account at disqus.com. Change enabled to
    // true and enter the shortname below.
    disqus: {
      enabled: true,
      shortname: 'testingsite23'
    }

  });

  // Markdown settings
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

});
