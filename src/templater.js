import { get } from './utils';
import { messages as msg, handleMessage } from './messages';

/**
 * Templating function that renders HTML templates.
 * @function
 * @param {string} text - HTML text to be evaluated.
 * @returns {string} Rendered template with injected data.
 */
export function Templater(text) {
  return new Function(
    'data',
    'var output=' +
    JSON.stringify(text)
      .replace(/<%=(.+?)%>/g, '"+($1)+"')
      .replace(/<%(.+?)%>/g, '";$1\noutput+="') +
    ';return output;'
  );
}

/**
 * Load template from URL.
 * @function
 * @async
 * @param {string} url - URL of template to load.
 * @param {object} data - Data to load into template.
 * @param {function} callback - Callback function
 */
export function loadTemplate(url, data, callback) {
  get(url, (success, error) => {
    if (error) callback(success, error);
    callback(Templater(success)(data), error);
  });
}

/**
 * Renders the layout into the main container.
 * @function renderLayout
 * @async
 * @param {string} layout - Filename of layout.
 * @param {object} data - Data passed to template.
 */
export function renderLayout(layout, config, data) {
  config.container.innerHTML = '';
  var url = [config.layoutDirectory, '/', layout, '.html'].join('');
  loadTemplate(url, data, (success, error) => {
    if (error) {
      handleMessage(msg['LAYOUT_LOAD_ERROR']);
    } else {
      config.container.innerHTML = success;
    }
  });
}
