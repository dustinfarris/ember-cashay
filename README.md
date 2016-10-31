# [WIP] ember-cashay

[![CircleCI](https://circleci.com/gh/dustinfarris/ember-cashay.svg?style=svg)](https://circleci.com/gh/dustinfarris/ember-cashay)

_Not ready for production!_

Use [Cashay](https://github.com/mattkrick/cashay) in your Ember project.

## Installation

ember-cashay and ember-redux rely on browserify to load npm packages.  For browserify to work, the host Ember app (your app) must explicitly install the dependencies.

Install ember-browserify and npm dependencies:

```
ember install ember-browserify
npm install --save redux
npm install --save redux-thunk
npm install --save graphql
npm install --save cashay
```

Then, install ember-cashay:

```
ember install ember-cashay
```

PhantomJS has limited support for certain ES6 features that are used by Cashay.  If you plan to use PhantomJS for testing, you will need to add the babel polyfill to your ember-cli-build.js:

```js
// ember-cli-build.js

var app = new EmberApp({
  babel: {
    includePolyfill: true
  }
});
```

## Configuration

Work in progress.


## Usage

Once installed, you can use Cashay anywhere.

Import Cashay using browserify:

```js
import npmCashay from 'npm:cashay';

const { cashay } = npmCashay;
```


### Example query

```js
let { users } = cashay.query(`{ users { id, name } }`).data;
```


## License

MIT
