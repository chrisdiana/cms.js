import { renderLayout } from './templater';
import { get, extend, getDatetime} from './utils';
import Markdown from './markdown';

/**
 * Represents a file.
 * @constructor
 * @param {string} url - The URL of the file.
 * @param {string} type - The type of file (i.e. posts, pages).
 * @param {object} layout - The layout templates of the file.
 */
class File {

  constructor(url, type, layout, config) {
    this.url = type === 'SERVER' ? type + '/' + url : url;
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
  }

  /**
  * Get file content.
  * @method
  * @async
  * @param {function} callback - Callback function.
  * @description
  * Get the file's HTML content and set the file object html
  * attribute to the file content.
  */
  getContent(callback) {
    get(this.url, (success, error) => {
      if (error) callback(success, error);
      this.content = success;
      // check if the response returns a string instead
      // of an response object
      if (typeof this.content === 'string') {
        callback(success, error);
      }
    });
  }

  /**
   * Parse front matter.
   * @method
   * @description
   * Overrides post attributes if front matter is available.
   */
  parseFrontMatter() {
    var yaml = this.content.split(this.config.frontMatterSeperator)[1];
    if (yaml) {
      var attributes = {};
      yaml.split(/\n/g).forEach((attributeStr) => {
        var attribute = attributeStr.split(':');
        attribute[1] && (attributes[attribute[0].trim()] = attribute[1].trim());
      });
      extend(this, attributes, null);
    }
  }

  /**
   * Set list attributes.
   * @method
   * @description
   * Sets front matter attributes that are specified as list attributes to
   * an array by splitting the string by commas.
   */
  setListAttributes() {
    this.config.listAttributes.forEach((attribute) => {
      if (this.hasOwnProperty(attribute) && this[attribute]) {
        this[attribute] = this[attribute].split(',').map((item) => {
          return item.trim();
        });
      }
    });
  }

  /**
   * Sets filename.
   * @method
   */
  setFilename() {
    this.name = this.url.substr(this.url.lastIndexOf('/'))
      .replace('/', '')
      .replace(this.config.extension, '');
  }

  /**
   * Sets permalink.
   * @method
   */
  setPermalink() {
    this.permalink = ['#', this.type, this.name].join('/');
  }

  /**
   * Set file date.
   * @method
   * @description
   * Check if file has date in front matter otherwise use the date
   * in the filename.
   */
  setDate() {
    var dateRegEx = new RegExp(this.config.dateParser);
    if (this.date) {
      this.datetime = getDatetime(this.date);
      this.date = this.config.dateFormat(this.datetime);
    } else if (dateRegEx.test(this.url)) {
      this.date = dateRegEx.exec(this.url);
      this.datetime = getDatetime(this.date);
      this.date = this.config.dateFormat(this.datetime);
    }
  }

  /**
   * Set file body.
   * @method
   * @description
   * Sets the body of the file based on content after the front matter.
   */
  setBody() {
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
  }

  /**
   * Parse file content.
   * @method
   * @description
   * Sets all file attributes and content.
   */
  parseContent() {
    this.setFilename();
    this.setPermalink();
    this.parseFrontMatter();
    this.setListAttributes();
    this.setDate();
    this.setBody();
  }

  /**
   * Renders file.
   * @method
   * @async
   */
  render() {
    return renderLayout(this.layout, this.config, this);
  }

}

export default File;
