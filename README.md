![CMS.js Logo](https://raw.githubusercontent.com/cdmedia/cms.js/gh-pages/img/logo-md.png)

CMS.js is fully client-side, Javascript site generator in the spirit of [Jekyll](https://github.com/jekyll/jekyll)
that uses plain ol' HTML, CSS and Javascript to generate your website. CMS.js is like a file-based CMS.
It takes your content, renders Markdown and delivers a complete website in Single-Page
App fashion...without the aid of server-side scripting (no Node.js, PHP, Ruby, etc.).

![CMS.js Screenshot](https://raw.githubusercontent.com/cdmedia/cms.js/gh-pages/img/screenshot.png)



## Demo

Check out a working [demo here](http://cdmedia.github.io/cms.js/demo/)


## Quick Start

CMS.js currently supports two website modes, Github and Apache.

**Github Mode**

This is the default mode for CMS.js. Host your website on Github using
Github Pages, similar to Jekyll.

**Apache Mode**

Use apache mode if you choose to self host your content. If you choose this option,
*make sure Apache with htaccess is enabled*.

**Install**

1. Clone the repo: `git clone https://github.com/cdmedia/cms.js.git`
2. Configure `js/config.js` to your liking
3. Make sure to set your `githubUserSettings` in `js/config.js` if using Github mode
4. If using Github mode, create a new branch from your master called `gh-pages`
   (Github's default branch for hosting)
4. Visit your site!


## How it works

**Github Mode**

In Github mode, CMS.js uses the Github API to get the content of your gh-pages repo
and serve them as a full website.

**Apache Mode**

In Apache mode, CMS.js takes advantage of Apache's Directory Indexing feature. By allowing indexes,
CMS.js sends an AJAX call to your specified folders and looks for Markdown files.
After they are found, it takes care of everything else and delivers a full website.


## Migration from Jekyll

**Importing Posts**

Once CMS.js is installed and running, simply copy all of your posts from your Jekyll
project's `_post` folder to your designated CMS.js posts folder.

**Importing Pages**

Copy all of your Markdown pages from your Jekyll projects root folder into your designated
CMS.js pages folder.


## Thanks!

* [Poole](https://github.com/poole/poole) (*Default Theme*)
* [jQuery](https://jquery.com/)
* [Marked](https://github.com/chjj/marked)


## Contributing

All forms of contribution are welcome: bug reports, bug fixes, pull requests and simple suggestions.
If you do wish to contribute, please follow the [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript/tree/master/es5) Thanks!


## List of contributors

You can find the list of contributors [here](https://github.com/cdmedia/cms.js/graphs/contributors).
