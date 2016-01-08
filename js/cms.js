/*
 * CMS.js v1.0.0
 * Copyright 2015 Chris Diana
 * www.cdmedia.github.io/cms.js
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

var CMS = {

	settings: {
		siteName: 'CMS.js',
		siteTagline: 'Your site tagline',
		siteEmail: 'your_email@example.com',
		siteAuthor: 'Your Name',
		siteUrl: '',
		siteNavItems: [
			{ name: 'Github', href: '#', newWindow: false},
			{ name: 'About' }
		],
		pagination: 3,
		postsFolder: 'posts',
		postSnippetLength: 120,
		pagesFolder: 'pages',
		fadeSpeed: 300,
		mainContainer: $('.cms_main'),
		footerContainer: $('.cms_footer'),
		footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',
		parseSeperator: '---',
		loader: '<div class="loader">Loading...</div>',
		get siteAttributes() {
			return [
				{ attr: 'title', value: CMS.settings.siteName },
				{ attr: '.cms_sitename', value: CMS.settings.siteName},
				{ attr: '.cms_tagline', value: CMS.settings.siteTagline},
				{ attr: '.cms_footer_text', value: CMS.settings.footerText}
			];
		},
		mode: 'Github',
		githubUserSettings: {
			username: 'yourusername',
			repo: 'yourrepo',
		},
		githubSettings: {
			branch: 'gh-pages',
			host: 'https://api.github.com'
		}
	},

	posts: [],
	pages: [],
	loaded: {},

	extend: function (target, opts, callback) {
		var next;
		if (typeof opts === "undefined") {
			opts = target;
			target = CMS;
		}
		for (next in opts) {
			if (Object.prototype.hasOwnProperty.call(opts, next)) {
				target[next] = opts[next];
			}
		}
		callback(); // check user config options
		return target;
	},

	render: function (url) {
		CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed);
		CMS.settings.footerContainer.hide();

		var type = url.split('/')[0];
		var map = {

			// Main view
			'' : function () {
				CMS.renderPosts();
			},

			// Post view
			'#post' : function() {
				var id = url.split('#post/')[1].trim();
				CMS.renderPost(id);
			},

			// Post view
			'#page' : function() {
				var title = url.split('#page/')[1].trim();
				CMS.renderPage(title);
			}

		};

		if (map[type]) {
			map[type]();
		} else {
			var errorMsg = 'Error loading page.';
			CMS.renderError(errorMsg);
		}
	},

	renderPage: function(title) {
		CMS.pages.forEach(function(page){
			if(page.title == title) {

				var tpl = $('#page-template').html(),
					$tpl = $(tpl);

				$tpl.find('.page-title').html(page.title);
				$tpl.find('.page-content').html(page.contentData);

				CMS.settings.mainContainer.html($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
			}
		});
		CMS.renderFooter();
	},

	renderPost: function(id) {
		CMS.posts.forEach(function(post){
			if(post.id == id) {

				var tpl = $('#post-template').html(),
					$tpl = $(tpl);

				$tpl.find('.post-title').html(post.title);
				$tpl.find('.post-date').html((post.date.getMonth() + 1) + '/' + post.date.getDate() + '/' +  post.date.getFullYear());
				$tpl.find('.post-content').html(post.contentData);

				CMS.settings.mainContainer.html($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
			}
		});
		CMS.renderFooter();
	},

	renderPosts: function() {
		CMS.posts.forEach(function(post){
			var tpl = $('#post-template').html(),
				$tpl = $(tpl);

			var title = '<a href="#">' + post.title + '</a>',
				date = (post.date.getMonth() + 1) + '/' + post.date.getDate() + '/' +  post.date.getFullYear(),
				snippet = post.contentData.split('.')[0] + '.';

			var postLink = $tpl.find('.post-title'),
				postDate = $tpl.find('.post-date'),
				postSnippet = $tpl.find('.post-content');

			postLink.on('click', function (e) {
				e.preventDefault();
				window.location.hash = 'post/' + post.id;
			});

			postLink.html(title);
			postSnippet.html(snippet);
			postDate.html(date);
			CMS.settings.mainContainer.append($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
		});
		CMS.renderFooter();
	},

	renderFooter: function() {
		// Load footer later so things dont look weird loading ajax stuff
		setTimeout(function () {
			CMS.settings.footerContainer.fadeIn(CMS.settings.fadeSpeed);
		}, 800);
	},

	renderError: function(msg) {
		var tpl = $('#error-template').html(),
			$tpl = $(tpl);

		$tpl.find('.error_text').html(msg);

		CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed, function(){
			CMS.settings.mainContainer.html($tpl).fadeIn(CMS.settings.fadeSpeed);
		});
	},

	contentLoaded: function(type) {

		CMS.loaded[type] = true;

		if(CMS.loaded.page && CMS.loaded.post) {

			// Set navigation
			this.setNavigation();

	        // Manually trigger on initial load
			$(window).trigger('hashchange');
		}
	},

	parseContent: function(content, type, file, counter, numFiles) {

		var data = content.split(CMS.settings.parseSeperator),
			contentObj = {},
			id = counter,
			date = file.date;

		contentObj.id = id;
		contentObj.date = date;

		// Get content info
		var infoData = data[1].split('\n');

		$.each(infoData, function(k, v) {
			if(v.length) {
				v.replace(/^\s+|\s+$/g, '').trim();
				var i = v.split(':');
				var val = i[1];
				k = i[0];
				contentObj[k] = val.trim();
			}
		});

		// Drop stuff we dont need
		data.splice(0,2);

		// Put everything back together if broken
		var contentData = data.join();
		contentObj.contentData = marked(contentData);


		if(type == 'post') {
			CMS.posts.push(contentObj);
		} else if (type == 'page') {
			CMS.pages.push(contentObj);
		}

		// Execute after all content is loaded
		if(counter === numFiles) {
			CMS.contentLoaded(type);
		}
	},

	getContent: function(type, file, counter, numFiles) {

		var urlFolder = '';

		switch(type) {
			case 'post':
				urlFolder = CMS.settings.postsFolder;
				break;
			case 'page':
				urlFolder = CMS.settings.pagesFolder;
				break;
		}

		if(CMS.settings.mode == 'Github') {
			url = file.link;
		} else {
			url = urlFolder + '/' + file.name;
		}

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'html',
			success: function(content) {
				CMS.parseContent(content, type, file, counter, numFiles);
			},
			error: function() {
				var errorMsg = 'Error loading ' + type + ' content';
				CMS.renderError(errorMsg);
			}
		});
	},

	getFiles: function(type) {

		var folder = '',
			url = '';

		switch(type) {
			case 'post':
				folder = CMS.settings.postsFolder;
				break;
			case 'page':
				folder = CMS.settings.pagesFolder;
				break;
		}

		if(CMS.settings.mode == 'Github') {
			var gus = CMS.settings.githubUserSettings,
				gs = CMS.settings.githubSettings;
			url = gs.host + '/repos/' + gus.username + '/' + gus.repo + '/contents/' + folder + '?ref=' + gs.branch;
		} else {
			url = folder;
		}

		$.ajax({
			url: url,
			success: function(data) {

				var files = [],
					linkFiles;

				if(CMS.settings.mode == 'Github') {
					linkFiles = data;
				} else {
					linkFiles = $(data).find("a");
				}

				$(linkFiles).each(function(k, f) {

					var filename,
						downloadLink;

					if(CMS.settings.mode == 'Github') {
						filename = f.name;
						downloadLink = f.download_url;
					} else {
						filename = $(f).attr("href");
					}

					if(filename.endsWith('.md')) {
						var file = {};
						file.date = new Date(filename.substring(0, 10));
						file.name = filename;
						if(downloadLink) {
							file.link = downloadLink;
						}
						files.push(file);
					}

				});

				var counter = 0,
					numFiles = files.length;

				if(files.length > 0) {
					$(files).each(function(k, file) {
						counter++;
						CMS.getContent(type, file, counter, numFiles);
					});
				} else {
					var errorMsg = 'Error loading ' + type + 's in directory. Make sure ' +
						'there are Markdown ' + type + 's in the ' + type + 's folder.';
					CMS.renderError(errorMsg);
				}
			},
			error: function() {
				var errorMsg;
				if(CMS.settings.mode == 'Github') {
					errorMsg = 'Error loading ' + type + 's directory. Make sure ' +
						'your Github settings are correctly set in your config.js file.';
				} else {
					errorMsg = 'Error loading ' + type + 's directory. Make sure ' +
						type + 's directory is set correctly in config and .htaccess is in ' +
						type + 's directory with Apache "Options Indexes" set on.';
				}
				CMS.renderError(errorMsg);
			}
		});
	},

	setNavigation: function() {

		var nav = '<ul>';
		CMS.settings.siteNavItems.forEach(function(navItem) {
			if(navItem.hasOwnProperty('href')) {
				nav += '<li><a href="' +  navItem.href + '"';
				if(navItem.hasOwnProperty('newWindow')) {
					if(navItem.newWindow) {
						nav += 'target="_blank"';
					}
				}
				nav += '>' + navItem.name + '</a></li>';
			} else {
				CMS.pages.forEach(function(page) {
					if(navItem.name == page.title) {
						nav += '<li><a href="#" class="cms_nav_link" id="' + navItem.name + '">' + navItem.name + '</a></li>';
					}
				});
			}
		});
		nav += '</ul>';

		$('.cms_nav').html(nav).hide().fadeIn(CMS.settings.fadeSpeed);

		// Set onclicks for nav links
		$.each($('.cms_nav_link'), function(k, link) {
			var title =  $(this).attr("id");
			$(this).on('click', function (e) {
				e.preventDefault();
				window.location.hash = 'page/' + title;
			});

		});
	},

	setSiteAttributes: function() {
		CMS.settings.siteAttributes.forEach(function(attribute) {

			var value;

			// Set brand
			if(attribute.attr == '.cms_sitename') {
				if (attribute.value.match(/\.(jpeg|jpg|gif|png)$/)) {
		            value = '<img src="' + attribute.value + '" />';
		        } else {
		            value = attribute.value;
		        }
			} else {
				value = attribute.value;
			}
			$(attribute.attr).html(value).hide().fadeIn(CMS.settings.fadeSpeed);
		});
	},

	generateSite: function() {

		this.setSiteAttributes();

		var types = ['post', 'page'];

		types.forEach(function(type){
			CMS.getFiles(type);
		});

		// Check for hash changes
        $(window).on('hashchange', function () {
            CMS.render(window.location.hash);
        });
	},

	init: function (options) {
		if ($.isPlainObject(options)) {
			return this.extend(this.settings, options, function () {
				CMS.generateSite();
			});
		}
	}

};