const defaults = {
  elementId: null,
  layoutDirectory: null,
  defaultView: null,
  errorLayout: null,
  mode: 'SERVER',
  github: null,
  types: [],
  plugins: [],
  frontMatterSeperator: '---',
  listAttributes: ['tags'],
  dateParser: /\d{4}-\d{2}(?:-\d{2})?/,
  extension: '.md',
  sort: undefined,
  markdownEngine: null,
  debug: false,
  messageClassName: 'cms-messages',
  onload: function() {},
  onroute: function() {},
};

export default defaults;
