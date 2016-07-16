# CMX.js

CMX.js is a fork of a CMX.js, a fully client-side, Javascript site generator in the spirit of [Jekyll](https://github.com/jekyll/jekyll)
that uses plain ol' HTML, CSS and Javascript to generate your website. CMX.js is like a file-based CMS.
It takes your content, renders Markdown and delivers a complete website in Single-Page
App fashion...without the aid of server-side scripting (no Node.js, PHP, Ruby, etc.).

## Features over CMS.js

In just the space of an hour, CMX.js has quite a few working and tested features over CMS.js:

* Client side plugin support.
* Custom theme support (with async stylesheet loading and the siteTheme attribute: most Bootswatch files should work out of the box, though may be necessary to get it how you want it to look)
* Hashbangs for page URLs, a now far more recognised way to showing an AJAX page load which makes life easier for some applications. #! > #.
* Improved default rapid deployment on any Apache server. Just unzip and you *should* be off to the races.

## Quick Start

CMX.js currently supports two website modes, Github and Server.

**Github Mode**

This is the default mode for CMX.js. Host your website on Github using
Github Pages, similar to Jekyll.

**Server Mode**

Use server mode if you choose to self host your content. Apache and NGINX servers are supported.
If using server mode, make sure the server's directory indexing feature is enabled.

* Apache - Make sure `htaccess` is enabled OR `Options Indexes` is set for your directory. On NearlyFreeSpeech, `Options +Indexes` is reccomended.
* NGINX - Make sure `autoindex on` is set for your directory

More info on server setup is available on the [wiki](https://github.com/cdmedia/CMX.js/wiki/Server-Support-&-Setup)


**Install**

1. Clone the repo: `git clone https://github.com/cdmedia/CMX.js.git` or download the [latest release](https://github.com/cdmedia/CMX.js/releases/latest)
2. Configure `js/config.js` to your liking
3. Make sure to set your `githubUserSettings` in `js/config.js` if using Github mode
4. If using Github mode, create a new branch from your master or working branch called `gh-pages`
   (Github's default branch for hosting)
5. Visit your site!


## How it works

**Github Mode**

In Github mode, CMX.js uses the Github API to get the content of your gh-pages repo
and serve them as a full website.

**Server Mode**

In Server mode, CMX.js takes advantage of the Server's Directory Indexing feature. By allowing indexes,
CMX.js sends an AJAX call to your specified folders and looks for Markdown files.
After they are found, it takes care of everything else and delivers a full website.

## Browser Compatibility

Due to its use of ES6 functions, CMX.js may not be compatible with all browsers. Any browser post 2014 should be sufficient. Versions older than this current commit/pull request suffer a crash in Safari 8 due to a lack of the endsWith() command, part of the ES6 specification. This problem has been fixed with the use of a "polyfill", which performs the same function as the needed component, though the code is located within CMX.js as opposed to inside the browser. CMX is undergoing rennovation work from CMS.js, where express changes will be made in order to maximise browser compatibility.

## Migration from Jekyll

**Importing Posts**

Once CMX.js is installed and running, simply copy all of your posts from your Jekyll
project's `_post` folder to your designated CMX.js posts folder.

**Importing Pages**

Copy all of your Markdown pages from your Jekyll projects root folder into your designated
CMX.js pages folder.


## Thanks!

* [Poole](https://github.com/poole/poole) (*Default Theme*)
* [jQuery](https://jquery.com/)
* [Marked](https://github.com/chjj/marked)
* [The original project](https://github.com/cdmedia/cms.js)


## Contributing

Send in a pull request and I'll go through it. :-)

## List of contributors

As it stands, I'm doing all the rennovations single-handed, mostly for my own personal use.

You can find the list of contributors for CMS.js [here](https://github.com/cdmedia/CMX.js/graphs/contributors).
