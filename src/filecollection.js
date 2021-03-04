import { messages as msg, handleMessage } from './messages';
import { renderLayout } from './templater';
import { get, isValidFile, getGithubUrl, getFilenameFromPath } from './utils';
import File from './file';

/**
 * Represents a file collection.
 * @constructor
 * @param {string} type - The type of file collection (i.e. posts, pages).
 * @param {object} layout - The layouts of the file collection type.
 */
class FileCollection {

  constructor(type, layout, config) {
    this.type = type;
    this.layout = layout;
    this.config = config;
    this.files = [];
    this[type] = this.files;
  }

  /**
   * Initialize file collection.
   * @method
   * @async
   * @param {function} callback - Callback function
   */
  init(callback) {
    this.getFiles((success, error) => {
      if (error) handleMessage(msg['DIRECTORY_ERROR']);
      this.loadFiles((success, error) => {
        if (error) handleMessage(msg['GET_FILE_ERROR']);
        callback();
      });
    });
  }

  /**
   * Get file list URL.
   * @method
   * @param {string} type - Type of file collection.
   * @returns {string} URL of file list
   */
  getFileListUrl(type, config) {
    return (config.mode === 'GITHUB') ? getGithubUrl(type, config.github) : type;
  }

  /**
   * Get file URL.
   * @method
   * @param {object} file - File object.
   * @returns {string} File URL
   */
  getFileUrl(file, mode, type) {
    return (mode === 'GITHUB') ? file['download_url'] : `${type}/${getFilenameFromPath(file.getAttribute('href'))}`;
  }

  /**
   * Get file elements.
   * @param {object} data - File directory or Github data.
   * @returns {array} File elements
   */
  getFileElements(data) {
    var fileElements;

    // Github Mode
    if (this.config.mode === 'GITHUB') {
      fileElements = JSON.parse(data);
    }
    // Server Mode
    else {
      // convert the directory listing to a DOM element
      var listElement = document.createElement('div');
      listElement.innerHTML = data;
      // get the links in the directory listing
      fileElements = [].slice.call(listElement.getElementsByTagName('a'));
    }
    return fileElements;
  }

  /**
   * Get files from file listing and set to file collection.
   * @method
   * @async
   * @param {function} callback - Callback function
   */
  getFiles(callback) {
    get(this.getFileListUrl(this.type, this.config), (success, error) => {
      if (error) callback(success, error);
      // find the file elements that are valid files, exclude others
      this.getFileElements(success).forEach((file) => {
        var fileUrl = this.getFileUrl(file, this.config.mode, this.type);
        if (isValidFile(fileUrl, this.config.extension)) {
          this.files.push(new File(fileUrl, this.type, this.layout.single, this.config));
        }
      });
      callback(success, error);
    });
  }

  /**
   * Load files and get file content.
   * @method
   * @async
   * @param {function} callback - Callback function
   */
  loadFiles(callback) {
    var promises = [];
    // Load file content
    this.files.forEach((file, i) => {
      file.getContent((success, error) => {
        if (error) callback(success, error);
        promises.push(i);
        file.parseContent();
        // Execute after all content is loaded
        if (this.files.length == promises.length) {
          callback(success, error);
        }
      });
    });
  }

  /**
   * Search file collection by attribute.
   * @method
   * @param {string} attribute - Attribue in file to search.
   * @param {string} search - Search query.
   * @returns {object} File object
   */
  search(attribute, search) {
    this[this.type] = this.files.filter((file) => {
      var attr = file[attribute].toLowerCase().trim();
      return attr.indexOf(search.toLowerCase().trim()) >= 0;
    });
  }

  /**
   * Reset file collection files.
   * @method
   */
  resetSearch() {
    this[this.type] = this.files;
  }

  /**
   * Get files by tag.
   * @method
   * @param {string} query - Search query.
   * @returns {array} Files array
   */
  getByTag(query) {
    this[this.type] = this.files.filter((file) => {
      if (query && file.tags) {
        return file.tags.some((tag) => {
          return tag === query;
        });
      }
    });
  }

  /**
   * Get file by permalink.
   * @method
   * @param {string} permalink - Permalink to search.
   * @returns {object} File object.
   */
  getFileByPermalink(permalink) {
    return this.files.filter((file) => {
      return file.permalink === permalink;
    })[0];
  }

  /**
   * Renders file collection.
   * @method
   * @async
   * @returns {string} Rendered layout
   */
  render() {
    return renderLayout(this.layout.list, this.config, this);
  }

}

export default FileCollection;
