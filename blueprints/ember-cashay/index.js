/*jshint node:true*/
module.exports = {
  description: 'Installation blueprint for ember-cashay',

  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-browserify', target: '^1.1.13' },
        { name: 'ember-redux', target: '^1.6.0' }
      ]
    }).then(function() {
      return this.addPackagesToProject([
        // TODO: Remove babel-runtime from host if possible
        { name: 'babel-runtime', target: '^6.18.0' },
        { name: 'cashay', target: '^0.20.12' },
        { name: 'graphql', target: '^0.7.1' }
      ])
    }.bind(this))
  }
};
