'use strict';

var loadEnIntl = function loadEnIntl() {
  return require.ensure([], function (require) {
    return require('intl/locale-data/jsonp/en.js');
  }, 'en-intl-local');
};

var loadEsIntl = function loadEsIntl() {
  return require.ensure([], function (require) {
    return require('intl/locale-data/jsonp/es.js');
  }, 'es-intl-local');
};

var intlLoaders = {
  'en': loadEnIntl,
  'es': loadEsIntl
};

module.exports = intlLoaders;