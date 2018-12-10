let messageContainer;

const messages = {
  NO_FILES_ERROR: 'ERROR: No files in directory',
  ELEMENT_ID_ERROR: 'ERROR: No element ID or ID incorrect. Check "elementId" parameter in config.',
  DIRECTORY_ERROR: 'ERROR: Error getting files. Make sure there is a directory for each type in config with files in it.',
  GET_FILE_ERROR: 'ERROR: Error getting the file',
  LAYOUT_LOAD_ERROR: 'ERROR: Error loading layout. Check the layout file to make sure it exists.',
  NOT_READY_WARNING: 'WARNING: Not ready to perform action',
};

/**
 * Creates message container element
 * @function
 * @param {string} classname - Container classname.
 */
function createMessageContainer(classname) {
  messageContainer = document.createElement('div');
  messageContainer.className = classname;
  messageContainer.innerHTML = 'DEBUG';
  messageContainer.style.background = 'yellow';
  messageContainer.style.position = 'absolute';
  messageContainer.style.top = '0px';
  document.body.appendChild(messageContainer);
}

/**
 * Handle messages
 * @function
 * @param {string} message - Message.
 * @returns {string} message
 * @description
 * Used for debugging purposes.
 */
function handleMessage(debug, message) {
  if (debug) messageContainer.innerHTML = message;
  return message;
}

export {
  messages,
  createMessageContainer,
  handleMessage,
};
