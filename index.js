/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var cashaySchema = require('broccoli-cashay-schema');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var graphql = require('graphql');


// TODO: Remove this polyfill once node 0.12.x support is no longer needed
//       (Twiddle currently uses 0.12)
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}


module.exports = {
  name: 'ember-cashay',

  isDevelopingAddon: function() {
    return false;
  },

  included: function(app) {
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof(app.import) !== 'function' && app.app) {
      app = app.app;
    }
    this.app = app;

    // Get build config from ember-cli-build.js
    this.addonBuildConfig = app.options['ember-cashay'] || {};
    // Get addon config from the usual config/environment.js
    this.addonConfig = app.project.config(app.env)['ember-cashay'] || {};

    this._super.included.apply(this, arguments);

    var rootDirectory;

    // Allow the build config to override the root directory
    // e.g. "tests/dummy/"
    if (this.addonBuildConfig['rootDirectory']) {
      rootDirectory = path.join(app.project.root, this.addonBuildConfig['rootDirectory']);
    } else {
      rootDirectory = app.project.root;
    }

    // Get the path to the graphql schema
    // DEFAULT: graphql/schema.js
    this.graphqlDir = this.addonConfig['schema-directory'];
    this.graphqlDir = path.join(rootDirectory, this.graphqlDir);
    this.graphqlSchemaPath = path.join(this.graphqlDir, 'schema.js');

    // Get the (app prefixed) output dir for the client-safe schema
    // DEFAULT: graphql/client
    this.clientOutputDir = this.addonConfig['clientOutputDir'] || path.join('graphql', 'client');
    // Get the (app prefixed) output dir for the server schema (non-prod only)
    // DEFAULT: graphql/server
    this.serverOutputDir = this.addonConfig['serverOutputDir'] || path.join('graphql', 'server');
  },

  treeForApp: function(appTree) {
    var trees = [ appTree ];

    // Add the server schema (non-prod)
    if (this.app.env !== 'production') {
      var serverTree = new Funnel(this.graphqlDir, {
        destDir: this.serverOutputDir
      });
      trees.push(serverTree);
    }

    // Add the client-safe schema
    var clientTree = cashaySchema(
      graphql,
      this.graphqlSchemaPath,
      path.join(this.clientOutputDir, 'schema.js'),
      { watchNode: appTree }
    );
    trees.push(clientTree);

    return mergeTrees(trees);
  }
};
