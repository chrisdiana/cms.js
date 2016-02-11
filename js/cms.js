/*
 * CMS.js v1.0.0
 * Copyright 2015 Chris Diana
 * www.cdmedia.github.io/cms.js
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
'use strict';

var CMS = {

  settings: {
    siteName: 'CMS.js',
    siteTagline: 'Your site tagline',
    siteEmail: 'your_email@example.com',
    siteAuthor: 'Your Name',
    siteUrl: '',
    siteNavItems: [
      { name: 'Github', href: '#', newWindow: false },
      { name: 'About' }
    ],
    pagination: 3,
    postsFolder: 'posts',
    postSnippetLength: 120,
    pagesFolder: 'pages',
    fadeSpeed: 300,
    mainContainer: $(document.getElementsByClassName('cms_main')),
    footerContainer: $(document.getElementsByClassName('cms_footer')),
    footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',
    parseSeperator: '---',
    postsOnFrontpage: true,
    pageAsFrontpage: '',
    postsOnUrl: '',
    loader: '<div class="loader">Loading...</div>',
    get siteAttributes() {
      return [
        { attr: 'title', value: CMS.settings.siteName },
        { attr: '.cms_sitename', value: CMS.settings.siteName },
        { attr: '.cms_tagline', value: CMS.settings.siteTagline },
        { attr: '.cms_footer_text', value: CMS.settings.footerText }
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
    if (typeof opts === 'undefined') {
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

  template: function (html) {
    var el = document.createElement('div');
    el.innerHTML = html;
    return el.childNodes[1];
  },

  render: function (url) {
    CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed);
    CMS.settings.footerContainer.hide();

    var type = url.split('/')[0];

    var map = {

      // Main view / Frontpage
      '' : function () {
          CMS.renderPosts();
      },

      // Post view / single view
      '#post' : function () {
        var id = url.split('#post/')[1].trim();
        CMS.renderPost(id);
      },

      // Page view
      '#page' : function () {
        var title = url.split('#page/')[1].trim();
        CMS.renderPage(title);
      }

    };

    if (map[type]) {
      map[type]();
    } else {
      // Error view
      var errorMsg = 'Error loading page.';
      CMS.renderError(errorMsg);
    }
  },

  renderPage: function (title) {
    CMS.pages.sort(function (a, b) { return CMS.settings.sortDateOrder ? b.date - a.date : a.date - b.date; });
    CMS.pages.forEach(function (page) {
      if (page.title == title) {
        var tpl = CMS.template(document.getElementById('page-template').innerHTML);
        tpl.childNodes[1].innerHTML = page.title;
        tpl.childNodes[3].innerHTML = page.contentData;

        CMS.settings.mainContainer.html(tpl).hide().fadeIn(CMS.settings.fadeSpeed);
      }
    });
    CMS.renderFooter();
  },

  renderPost: function (id) {
    CMS.posts.forEach(function (post) {
      if (post.id == id) {

        var tpl = CMS.template(document.getElementById('post-template').innerHTML);
        tpl.childNodes[1].innerHTML = post.title;
        tpl.childNodes[3].innerHTML = (post.date.getMonth() + 1) + '/' + post.date.getDate() + '/' +  post.date.getFullYear();
        tpl.childNodes[5].innerHTML = post.contentData;

        CMS.settings.mainContainer.html(tpl).hide().fadeIn(CMS.settings.fadeSpeed);
      }
    });
    CMS.renderFooter();
  },

  renderPosts: function () {
    CMS.posts.sort(function (a, b) { return CMS.settings.sortDateOrder ? b.date - a.date : a.date - b.date; });
    CMS.posts.forEach(function (post) {
      var tpl = CMS.template(document.getElementById('post-template').innerHTML);

      var title = '<a href="#">' + post.title + '</a>',
        date = (post.date.getMonth() + 1) + '/' + post.date.getDate() + '/' +  post.date.getFullYear(),
        snippet = post.contentData.split('.')[0] + '.';

      tpl.childNodes[1].onclick = function (e) {
        e.preventDefault();
        window.location.hash = 'post/' + post.id;
      }

      tpl.childNodes[1].innerHTML = title;
      tpl.childNodes[3].innerHTML = snippet;
      tpl.childNodes[5].innerHTML = date;

      CMS.settings.mainContainer.append(tpl).hide().fadeIn(CMS.settings.fadeSpeed);
    });
    CMS.renderFooter();
  },

  renderFooter: function () {
    // Delay footer loading while waiting on ajax requests
    setTimeout(function () {
      CMS.settings.footerContainer.fadeIn(CMS.settings.fadeSpeed);
    }, 800);
  },

  renderError: function (msg) {
    var tpl = CMS.template(document.getElementById('error-template').innerHTML);

    tpl.childNodes[3].innerHTML = msg;
    CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed, function () {
      CMS.settings.mainContainer.html(tpl).fadeIn(CMS.settings.fadeSpeed);
    });
  },

  contentLoaded: function (type) {

    CMS.loaded[type] = true;

    if (CMS.loaded.page && CMS.loaded.post) {

      // Set navigation
      this.setNavigation();

      // Manually trigger on initial load
      $(window).trigger('hashchange');
    }
  },

  parseContent: function (content, type, file, counter, numFiles) {

    var data = content.split(CMS.settings.parseSeperator),
      contentObj = {},
      id = counter,
      date = file.date;

    contentObj.id = id;
    contentObj.date = date;

    // Get content info
    var infoData = data[1].split(/[\n\r]+/);
    infoData.forEach(function (v) {
      if (v.length) {
        v.replace(/^\s+|\s+$/g, '').trim();
        var i = v.split(':');
        var val = v.slice(v.indexOf(':')+1);
        infoData = i[0];

        val = (infoData == 'date' ? (new Date(val)) : val);

        contentObj[infoData] = (val.trim ? val.trim() : val);
      }
    });

    // Drop data we don't need
    data.splice(0, 2);

    // Put everything back together if broken
    var contentData = data.join();
    contentObj.contentData = marked(contentData);

    switch(type) {
      case 'post':
        CMS.posts.push(contentObj);
        break;
      case 'page':
        CMS.pages.push(contentObj);
        break;
    }

    // Execute after all content is loaded
    if (counter === numFiles) {
      CMS.contentLoaded(type);
    }
  },

  get: function (url) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onerror = function() {
      return 'Network Error';
    }
    request.send();
    return {
      then: function (success, error) {
        request.onload = function () {
          if (request.status == 200) {
            success(request.response);
          } else {
            error();
          }
        }
      }
    }
  },

  getContent: function (type, file, counter, numFiles) {

    var urlFolder = '',
        url;

    switch(type) {
      case 'post':
        urlFolder = CMS.settings.postsFolder;
        break;
      case 'page':
        urlFolder = CMS.settings.pagesFolder;
        break;
    }

    if (CMS.settings.mode == 'Github') {
      url = file.link;
    } else {
      url = file.name;
    }

    CMS.get(url).then(
      function success(content) {
        CMS.parseContent(content, type, file, counter, numFiles);
      },
      function error() {
        var errorMsg = 'Error loading ' + type + ' content';
        CMS.renderError(errorMsg);
      }
    );

  },

  getFiles: function (type) {

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

    if (CMS.settings.mode == 'Github') {
      var gus = CMS.settings.githubUserSettings,
        gs = CMS.settings.githubSettings;
      url = gs.host + '/repos/' + gus.username + '/' + gus.repo + '/contents/' + folder + '?ref=' + gs.branch;
    } else {
      url = folder;
    }

    CMS.get(url).then(
      function success(data) {

        var files = [],
          linkFiles,
          dateParser = /\d{4}-\d{2}(?:-d{2})?/; // can parse both 2016-01 and 2016-01-01

        if (CMS.settings.mode == 'Github') {
          linkFiles = JSON.parse(data);
        } else {
          linkFiles = $(data).find('a');
        }
        for (var i = 0; i < linkFiles.length; i++) {
          var f = linkFiles[i];
          var filename,
            downloadLink;

          if (CMS.settings.mode == 'Github') {
            filename = f.name;
            downloadLink = f.download_url;
          } else {
            filename = $(f).attr('href');
          }

          if (filename.endsWith('.md')) {
            var file = {};
            file.date = new Date(dateParser.test(filename) && dateParser.exec(filename)[0]);
            file.name = filename;
            if (downloadLink) {
              file.link = downloadLink;
            }
            files.push(file);
          }

        }

        var counter = 0,
          numFiles = files.length;
        if (numFiles > 0) {
          for (var i = 0; i < numFiles; i++) {
            var file = files[i];
            counter++;
            CMS.getContent(type, file, counter, numFiles);
          }
        } else {
          var errorMsg = 'Error loading ' + type + 's in directory. Make sure ' +
            'there are Markdown ' + type + 's in the ' + type + 's folder.';
          CMS.renderError(errorMsg);
        }
      },
      function error() {
        var errorMsg;
        if (CMS.settings.mode == 'Github') {
          errorMsg = 'Error loading ' + type + 's directory. Make sure ' +
            'your Github settings are correctly set in your config.js file.';
        } else {
          errorMsg = 'Error loading the ' + type + 's directory. Make sure ' +
            'the ' + type + 's directory is set correctly in config and  ' +
            'the ' + type + 's directory indexing feature is enabled.';
        }
        CMS.renderError(errorMsg);
      }
    );
  },

  setNavigation: function () {

    var navBuilder = ['<ul>'];
    CMS.settings.siteNavItems.forEach(function (navItem) {
      if (navItem.hasOwnProperty('href')) {
        navBuilder.push('<li><a href="', navItem.href, '"');
        if (navItem.hasOwnProperty('newWindow') && navItem.newWindow) {
          navBuilder.push('target="_blank"');
        }
        navBuilder.push('>', navItem.name, '</a></li>');
      } else {
        CMS.pages.forEach(function (page) {
          if (navItem.name == page.title) {
            navBuilder.push('<li><a href="#" class="cms_nav_link" id="', navItem.name, '">', navItem.name, '</a></li>');
          }
        });
      }
    });
    navBuilder.push('</ul>');
    var nav = navBuilder.join('');

    document.querySelector('.cms_nav').innerHTML = nav;

    // Set onclicks for nav links
    var elements = document.getElementsByClassName('cms_nav_link');
    for (var i = 0; i < elements.length; i++) {
      var title = elements[i].getAttribute('id');
      elements[i].onclick = function (e) {
        e.preventDefault();
        window.location.hash = 'page/' + title;
      }
    }
  },

  setSiteAttributes: function () {
    CMS.settings.siteAttributes.forEach(function (attribute) {

      var value;

      // Set brand
      if (attribute.attr == '.cms_sitename' && attribute.value.match(/\.(jpeg|jpg|gif|png)$/)) {
        value = '<img src="' + attribute.value + '" />';
      } else {
        value = attribute.value;
      }
      $(attribute.attr).html(value).hide().fadeIn(CMS.settings.fadeSpeed);
    });
  },

  generateSite: function () {

    this.setSiteAttributes();

    var types = ['post', 'page'];

    types.forEach(function (type) {
      CMS.getFiles(type);
    });

    // Check for hash changes
    $(window).on('hashchange', function () {
      CMS.render(window.location.hash);
    });
  },

  init: function (options) {
    if (!(options instanceof Array)) {
      return this.extend(this.settings, options, function () {
        CMS.generateSite();
      });
    }
  }

};