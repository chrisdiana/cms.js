![CMS.js Logo](https://raw.githubusercontent.com/chrisdiana/cms.js/gh-pages/img/logo-md.png)

CMS.js 是一个基于Javascript的客户端的网页生成器，本着[Jekyll](https://github.com/jekyll/jekyll)的精神，使用HTML，CSS 和 JavaScript 生产你的网站。 CMS.js 是基于文件的内容管理系统。
他根据你的内容渲染生成单页网页应用，无需服务器端的帮助(无Node.js, PHP, Ruby, 等等）。

![CMS.js Screenshot](https://raw.githubusercontent.com/chrisdiana/cms.js/gh-pages/img/screenshot.png)

## 版本2.0新功能

* Zero dependencies
* Abstract types
* Custom Templates
* Search, Filtering, Tagging and Sorting
* Github & Server Mode
* Extendable Markdown Renderer and Plugins
* Super small footprint - 10kb minified


## 样本

查看[样本](http://chrisdiana.github.io/cms.js/demo)


## 快速开始

CMS.js 支持两种网站模式， Github和服务器。利用Github Pages (相似于Jekyll) 部署你的网站到Github或者使用服务器模式如果你选择自己部署内容。了解更多服务器模式 [点击这里](https://github.com/chrisdiana/cms.js/wiki/Server-Mode).

1. 克隆你的[starter repo](https://github.com/chrisdiana/cms.js-starter): `git clone https://github.com/chrisdiana/cms.js-starter.git` 或下载 [latest release here](https://github.com/chrisdiana/cms.js/releases/latest)
2. 配置 `js/config.js` 到你的链接
3. 确保设置好你的Github在 `js/config.js` 如果使用Github模式
4. 如果使用Github模式，创建新分支从你的master或者工作`gh-pages` (Github的默认部署分支)
5. 访问你的网站！ (点击以下网址`https://yourusername.github.io/cms.js-starter`)


## 主题

尝试CMS.js和许多CSS框架，例如Bootstrap, Foundation, and Bulma。查看所有主题 [点击这里](https://chrisdiana.github.io/cms.js-themes).

![CMS.js Themes](./img/themes.png)


## 如何工作

**Github模式**

在Github模式, CMS.js使用Github API获取你的仓库内容然后成为一个网站。

**服务器模式**

在服务器模式，CMS.js 利用服务器的目录索引功能。CMS.js 发送 AJAX 请求到你的文件夹然后寻找HTML文件。
当他们被找到后，生成一个网站。


## 从Jekyll迁移

**导入Posts**

一旦CMS.js安装运行后， 它将拷贝你的posts从Jekyll的 `_post` 文件夹到你指定的CMS.js posts文件夹。

**导入页面**

拷贝你的页面从你的Jekyll根目录到你指定的CMS.js页面文件夹。


## 即将到来!

* Pagination
* Template caching
* Loader
* CLI Utilities


## 感谢!

* [Poole](https://github.com/poole/poole) (*默认主题*)


## 贡献

欢迎所有形式的贡献: 修复，报告bug，pull requests 和建议。如果你想贡献，请查看[贡献指导](https://github.com/chrisdiana/cms.js/wiki/Contributing-Guide) 在你发送pull request之前。谢谢!


## 贡献者列表

你可以找到贡献者列表[点击这里](https://github.com/chrisdiana/cms.js/graphs/contributors).
