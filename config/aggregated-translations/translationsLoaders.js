'use strict';

const loadEnTranslations = (callback, scope) =>
   import( /* webpackChunkName: "en-translations" */ 'en.js')
     .then((module) => { callback.call(scope, module);})
     .catch(error => console.log('An error occurred while loading en.js' + "\n" + error));

const loadEnUSTranslations = (callback, scope) =>
   import( /* webpackChunkName: "en-US-translations" */ 'en-US.js')
     .then((module) => { callback.call(scope, module);})
     .catch(error => console.log('An error occurred while loading en-US.js' + "\n" + error));

var translationsLoaders = {
  'en': loadEnTranslations,
  'en-US': loadEnUSTranslations
};

module.exports = translationsLoaders;