/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    'ember-cashay': {
      'graphql-endpoint': '/graphql',
      'schema-directory': 'graphql'
    }
  };
};
