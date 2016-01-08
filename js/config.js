$(function() {

	CMS.init({

		// Name of your site
		siteName: 'CMS.js',

		// Tagline for your site
		siteTagline: 'The Javascript CMS',

		// Email address
		siteEmail: 'your_email@example.com',

		// Name
		siteAuthor: 'Your Name',

		// Navigation items
		siteNavItems: [
			{ name: 'Github', href: 'https://github.com/cdmedia/cms.js', newWindow: true},
			{ name: 'About'},
			{ name: 'Links'},
		],

		// Posts folder name
		postsFolder: 'posts',

		// Homepage posts snippet length
		postSnippetLength: 120,

		// Pages folder name
		pagesFolder: 'pages',

		// Site fade speed
		fadeSpeed: 300,

		// Site footer text
		footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',

		// Mode 'Github' for Github Pages, 'Apache' for Apache server
		mode: 'Github',

		// If Github mode is set, your Github username and repo name. Defaults
		// to Github pages branch (gh-pages)
		githubSettings: {
			username: 'cdmedia',
			repo: 'cms.js'
		}

	});

	// Markdown settings
	marked.setOptions({
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false
	});

});
