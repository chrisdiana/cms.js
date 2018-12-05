import { get, extend, formatDate, Markdown, renderLayout } from './utils';

/**
 * Represents a file.
 * @constructor
 * @param {string} url - The URL of the file.
 * @param {string} type - The type of file (i.e. posts, pages).
 * @param {object} layout - The layout templates of the file.
 */
var File = function(url, type, layout, config) {
  this.url = url;
  this.type = type;
  this.layout = layout;
  this.config = config;
  this.html = false;
  this.content;
  this.name;
  this.extension;
  this.title;
  this.excerpt;
  this.date;
  this.datetime;
  this.author;
  this.body;
  this.permalink;
  this.tags;
};

File.prototype = {

  /**
  * Get file content.
  * @method
  * @async
  * @param {function} callback - Callback function.
  * @description
  * Get the file's HTML content and set the file object html
  * attribute to the file content.
  */
  getContent: function(callback) {
    get(this.url, function(success, error) {
      if (error) callback(success, error);
      this.content = success;
      // check if the response returns a string instead
      // of an response object
      if (typeof this.content === 'string') {
        callback(success, error);
      }
    }.bind(this));
  },

  /**
   * Parse front matter.
   * @method
   * @description
   * Overrides post attributes if front matter is available.
   */
  parseFrontMatter: function() {
    var yaml = this.content.split(this.config.frontMatterSeperator)[1];
    if (yaml) {
      var attributes = {};
      yaml.split(/\n/g).forEach(function(attributeStr) {
        var attribute = attributeStr.split(':');
        attribute[1] && (attributes[attribute[0].trim()] = attribute[1].trim());
      });
      extend(this, attributes, null);
    }
  },

  /**
   * Set list attributes.
   * @method
   * @description
   * Sets front matter attributes that are specified as list attributes to
   * an array by splitting the string by commas.
   */
  setListAttributes: function() {
    this.config.listAttributes.forEach(function(attribute) {
      if (this.hasOwnProperty(attribute) && this[attribute]) {
        this[attribute] = this[attribute].split(',').map(function(item) {
          return item.trim();
        });
      }
    }.bind(this));
  },

  /**
   * Sets filename.
   * @method
   */
  setFilename: function() {
    this.name = this.url.substr(this.url.lastIndexOf('/'))
      .replace('/', '')
      .replace(this.config.extension, '');
  },

  /**
   * Sets permalink.
   * @method
   */
  setPermalink: function() {
    this.permalink = ['#', this.type, this.name].join('/');
  },

  /**
   * Set file date.
   * @method
   * @description
   * Check if filename has date otherwise use the date
   * in the front matter.
   */
  setDate: function() {
    var dateRegEx = new RegExp(this.config.dateParser);
    if (this.date) {
      this.datetime = new Date(this.date);
      this.date = formatDate(this.date);
    } else if (dateRegEx.test(this.url)) {
      this.date = dateRegEx.exec(this.url);
      this.datetime = new Date(this.date);
      this.date = formatDate(this.date);
    }
  },

  /**
   * Set file body.
   * @method
   * @description
   * Sets the body of the file based on content after the front matter.
   */
  setBody: function() {
    var html = this.content
      .split(this.config.frontMatterSeperator)
      .splice(2)
      .join(this.config.frontMatterSeperator);
    if (this.html) {
      this.body = html;
    } else {
      if (this.config.markdownEngine) {
        this.body = this.config.markdownEngine(html);
      } else {
        var md = new Markdown();
        this.body = md.render(html);
      }
    }
  },

  /**
   * Parse file content.
   * @method
   * @description
   * Sets all file attributes and content.
   */
  parseContent: function() {
    this.setFilename();
    this.setPermalink();
    this.parseFrontMatter();
    this.setListAttributes();
    this.setDate();
    this.setBody();
  },

  /**
   * Renders file.
   * @method
   * @async
   */
  render: function() {
    return renderLayout(this.layout, this.config, this);
  },
};

export default File;