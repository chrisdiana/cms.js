let container;

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
 * AJAX Get utility function.
 * @function
 * @async
 * @param {string} url - URL of the request.
 * @param {function} callback - Callback after request is complete.
 */
export function get(url, callback) {
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) {
        callback(req.response, false);
      } else {
        callback(req, req.statusText);
      }
    }
  };
  req.send();
}

/**
 * Extend utility function for extending objects.
 * @function
 * @param {object} target - Target object to extend.
 * @param {object} opts - Options to extend.
 * @param {function} callback - Callback function after completion.
 * @returns {object} Extended target object.
 */
export function extend(target, opts, callback) {
  var next;
  if (typeof opts === 'undefined') {
    opts = target;
  }
  for (next in opts) {
    if (Object.prototype.hasOwnProperty.call(opts, next)) {
      target[next] = opts[next];
    }
  }
  if (callback) {
    callback();
  }
  return target;
}

/**
 * Utility function for getting a function name.
 * @function
 * @param {function} func - The function to get the name
 * @returns {string} Name of function.
 */
export function getFunctionName(func) {
  var ret = func.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

/**
 * Checks if the file URL with file extension is a valid file to load.
 * @function
 * @param {string} fileUrl - File URL
 * @returns {boolean} Is valid.
 */
export function isValidFile(fileUrl, extension) {
  if (fileUrl) {
    var ext = fileUrl.split('.').pop();
    return (ext === extension.replace('.', '') || ext === 'html') ? true : false;
  }
}

/**
 * Get URL paths without parameters.
 * @function
 * @returns {string} URL Path
 */
export function getPathsWithoutParameters() {
  return window.location.hash.split('/').map(function(path) {
    if (path.indexOf('?') >= 0) {
      path = path.substring(0, path.indexOf('?'));
    }
    return path;
  }).filter(function(path) { return path !== '#'; });
}

/**
 * Get URL parameter by name.
 * @function
 * @param {string} name - Name of parameter.
 * @param {string} url - URL
 * @returns {string} Parameter value
 */
export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
  get(url, function(success, error) {
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
  loadTemplate(url, data, function(success, error) {
    if (error) {
      handleMessage(msg['LAYOUT_LOAD_ERROR']);
    } else {
      config.container.innerHTML = success;
    }
  });
}

/**
 * Get Github URL based on configuration.
 * @function
 * @param {string} type - Type of file.
 * @returns {string} GIthub URL
 */
export function getGithubUrl(type, gh) {
  var url = [gh.host, 'repos', gh.username, gh.repo, 'contents',
    type + '?ref=' + gh.branch];
  if (gh.prefix) url.splice(5, 0, gh.prefix);
  return url.join('/');
}

/**
 * Formats date string to d/m/yyyy.
 * @param {string} dateString - Date string to convert.
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  var date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return [date.getDate(),
    (date.getMonth() + 1),date.getFullYear()].join('/');
}
