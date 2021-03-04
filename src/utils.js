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
  return window.location.hash.split('/').map((path) => {
    if (path.indexOf('?') >= 0) {
      path = path.substring(0, path.indexOf('?'));
    }
    return path;
  }).filter((path) => { return path !== '#'; });
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
 * Get Github URL based on configuration.
 * @function
 * @param {string} type - Type of file.
 * @returns {string} GIthub URL
 */
export function getGithubUrl(type, gh) {
  var url = [gh.host, 'repos', gh.username, gh.repo, 'contents', type + '?ref=' + gh.branch];
  if (gh.prefix) url.splice(5, 0, gh.prefix);
  return url.join('/');
}

/**
 * Formats date string to datetime
 * @param {string} dateString - Date string to convert.
 * @returns {object} Formatted datetime
 */
export function getDatetime(dateStr) {
  var dt = new Date(dateStr);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * (-60000));
}

/**
 * @param {string} filepath - Full file path including file name.
 * @returns {string} filename
 */
export function getFilenameFromPath(filepath) {
  return filepath.split('\\').pop().split('/').pop();
}
