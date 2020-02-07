'use strict';

var loadEnTranslations = function loadEnTranslations(callback, scope) {
  return require.ensure([], function (require) {
    // eslint-disable-next-line
    var i18n = require('./en.js');
    callback.call(scope, i18n);
    return i18n;
  }, 'en-translations');
};

var loadEsTranslations = function loadEsTranslations(callback, scope) {
  return require.ensure([], function (require) {
    // eslint-disable-next-line
    var i18n = require('./es.js');
    callback.call(scope, i18n);
    return i18n;
  }, 'es-translations');
};

var translationsLoaders = {
  'en': loadEnTranslations,
  'es': loadEsTranslations
};

module.exports = translationsLoaders;