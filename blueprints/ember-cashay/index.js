/*jshint node:true*/
module.exports = {
  description: 'Installation blueprint for ember-cashay',

  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-browserify', target: '^1.1.13' },
        { name: 'ember-redux', target: '^1.9.0' }
      ]
    }).then(function() {
      return this.addPackagesToProject([
        { name: 'cashay', target: '^0.22.0' },
        { name: 'graphql', target: '^0.7.1' }
      ])
    }.bind(this))
  }
};
