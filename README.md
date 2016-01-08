# CMS.js

CMS.js is fully client-side, pure Javascript static site generator in the spirit of [Jekyll](https://github.com/jekyll/jekyll)
that uses plain ol' HTML, CSS and Javascript to generate your website. CMS.js is like a file-based CMS.
It takes your content, renders Markdown and delivers a complete website in Single-Page Application fashion...
without the aid of server-side scripting (no Node.js, PHP, Ruby, etc.).


## Requirements:

* Apache with htaccess enabled


## How it works

CMS.js takes advantage of Apache's Directory Indexing feature. By allowing indexes,
CMS.js sends an AJAX call to your specified folders and looks for Markdown files.
After they are found, it takes care of everything else and delivers a full website.


## Quick Start

1.Clone the repo: `git clone https://github.com/cdmedia/cms.js.git`
2.Run `bower install`
3.Make sure Apache htaccess is enabled
4.Configure `js/config.js` to your liking
5.Visit your site!


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
