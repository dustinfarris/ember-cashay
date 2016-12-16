/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var cashaySchema = require('broccoli-cashay-schema');
var esTranspiler = require('broccoli-babel-transpiler');
var merge = require('broccoli-merge-trees');
var path = require('path');
var graphql = require('graphql');
var cashay = require('cashay');

var WebpackWriter = require('broccoli-webpack');

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

    app.import('vendor/cashay.amd.js');

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

    // Get the directory of the user-provided graphql schema
    // DEFAULT: graphql-server
    this.graphqlDir = this.addonConfig['schema-directory'];
    this.graphqlDir = path.join(rootDirectory, this.graphqlDir);

    // Get the (app prefixed) output dir for the client-safe schema
    // DEFAULT: app/graphql-client
    this.clientOutputDir = this.addonConfig['clientOutputDir'] || 'graphql-client';
    // Get the (app prefixed) output dir for the server schema (non-prod only)
    // DEFAULT: app/graphql-server
    this.serverOutputDir = this.addonConfig['serverOutputDir'] || 'graphql-server';
  },

  treeForApp: function(appTree) {
    var trees = [ appTree ];

    // Add the server schema (non-prod)
    // TODO: Make the check for `enabled` respect explicit `false`
    if (this.app.env !== 'production' || this.addonConfig['copy-server-schema']) {
      var serverTree = new Funnel(this.graphqlDir, {
        destDir: this.serverOutputDir
      });
      trees.push(serverTree);
    }

    // Add the client-safe schema
    var clientTree = cashaySchema(esTranspiler(this.graphqlDir), {
      cashay: cashay,
      graphql: graphql,
      clientSchemaPath: path.join(this.clientOutputDir, 'schema.js')
    });
    trees.push(clientTree);

    return merge(trees);
  },

  treeForVendor: function(tree) {
    const cashayPath = path.dirname(require.resolve('cashay'));
    const cashayNode = esTranspiler(cashayPath, {
      babel: {
        presets: ['stage-1']
      }
    });
    const cashayTree = new WebpackWriter([ cashayPath ], {
      entry: './index.js',
      modules: {
        /*
        loaders: [{
          test: /\.js$/,
          loaders: ['babel-loader'],
          query: {
            presets: ['stage-1']
          }
        }]
        */
      },
      output: {
        library: 'cashay',
        libraryTarget: 'amd',
        filename: 'cashay.amd.js',
      }
    });

    if (!tree) {
      return this._super.treeForVendor.call(this.cashayTree);
    }

    const trees = merge([cashayTree, tree], {
      overwrite: true
    });

    return this._super.treeForVendor.call(this, trees);
  }
};
