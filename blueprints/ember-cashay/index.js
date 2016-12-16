/*jshint node:true*/
module.exports = {
  description: 'Installation blueprint for ember-cashay',

  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        { name: 'ember-redux', target: '^1.10.0' },
        { name: 'ember-graphql-shim', target: '^0.1.0' }
      ]
    }).then(function() {
      return this.addPackagesToProject([
        { name: 'cashay', target: '^0.22.1' }
      ])
    }.bind(this))
  }
};
