'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/react-material-table.cjs.production.js');
} else {
  module.exports = require('./dist/react-material-table.cjs.development.js');
}
