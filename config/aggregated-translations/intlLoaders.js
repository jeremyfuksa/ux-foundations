'use strict';

const loadEnIntl = () =>
   import('intl/locale-data/jsonp/en.js')
   .catch(error => console.log('An error occurred while loading intl/locale-data/jsonp/en.js' + "\n" + error));

const loadEnUSIntl = () =>
   import('intl/locale-data/jsonp/en-US.js')
   .catch(error => console.log('An error occurred while loading intl/locale-data/jsonp/en-US.js' + "\n" + error));

var intlLoaders = {
  'en': loadEnIntl,
  'en-US': loadEnUSIntl
};

module.exports = intlLoaders;