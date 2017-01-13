# ember-cashay

[![CircleCI](https://circleci.com/gh/dustinfarris/ember-cashay.svg?style=svg)](https://circleci.com/gh/dustinfarris/ember-cashay)

Use [Cashay](https://github.com/mattkrick/cashay) in your Ember project.

If you're looking for an all-in-one Ember+Redux+GraphQL solution, this is for you.  Cashay accepts GraphQL queries and checks for the data in Redux.  If the data isn't there, it sends a GraphQL network request to your backend API, and stores the result in Redux.  It's just that simple.

_Note: ember-cashay is pre-1.0.  Things may move around with little notice._


## Installation

Installing ember-cashay gives you ember-redux, cashay, and graphql, all at once.

```
ember install ember-cashay
```


If everything went well, you should have a GraphQL schema in `graphql-server/schema.js`.  Tailor this to suit your requirements.


## Usage

Once installed, you can use Cashay anywhere.


### Example query

```js
import { cashay } from 'cashay';

let { users } = cashay.query(`{ users { id, name } }`).data;
```


### Connected components

Once you get the hang of GraphQL queries, you'll want to start connecting the data to your Ember components for instant updates and pragmatic design.

```js
// components/users-list.js

import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import { cashay } from 'cashay';

const { Component } = Ember;


const usersQuery = `
{
  users {
    id
    name
  }
}
`;


const stateToComputed = () => {
  const {
    data: { users },
    status
  } = cashay.query(usersQuery);

  return {
    isLoading: status === 'loading',
    users
  };
};


const UsersListComponent = Component.extend({
  layout: hbs`
    {{#if isLoading}}
      <h6>Loading ...</h6>
    {{else}}
      {{#each users as |user|}}
        <div>
          {{link-to user.name "user" user.id}}
        </div>
      {{/each}}
    {{/if}}
  `
});


export default connect(stateToComputed)(UsersListComponent);
```

### Subscriptions

How you manage subscription data is up to you, but Cashay makes it easier by providing the `@live` decorator.

To use it, you will define:

- Your priority transport (probably some kind of websocket connection)
- How data received on channels should be handled
- Which fields on your queries subscribe to live data

See the dummy app for an example of doing this with a mock websocket server.

Your queries will end up looking like this when all is said and done:

```js
const projectQuery = `
{
  project (id: $project_id) @live {
    id
    title
    description
    todos @live {
      id
      name
    }
  }
}
`;
```

That's it!  Cashay will run your subscriber function to compute an appropriate channel name and key, and start updating the query result as new data comes in.  See the Cashay docs for more details.

Note that you don't have to use GraphQL subscriptions for this to work (although you can if you want!).  You can memoize and optimize to your heart's content, or not.

There's a lot more you can do with Cashay.  For instance, Cashay will write your mutations for you!

See additional examples on the [ember-cashay Twiddle demo](https://ember-twiddle.com/f2a8a4123c65c4871a885444978efe65?openFiles=components.users-list.js%2C)!


## Configuration


### GraphQL Endpoint

You'll want to configure the GraphQL endpoint URL for your environment.

The default is `/graphql`.

Example:

```js
// config/environment.js
...
if (environment === 'production') {
  ENV['ember-cashay'] = {
    'graphql-endpoint': 'https://example.com/graphql'
  }
}
```


### Schema Location

If for some reason you don't like having your server schema in a `graphql-server/` directory, you can override this in the 'schema-directory' setting.  ember-cashay will look for a `schema.js` in whatever directory you provide.

Example (if you wanted to keep the schema in `server/schema.js` instead):

```js
ENV['ember-cashay'] = {
  'schema-directory': 'server'
}
```


### Copy server schema

By default, ember-cashay will copy your server schema to the app build in non-production environments.  This allows you to use the schema to mock a backend server using Mirage or something similar.

If you want to force ember-cashay to copy the schema even in production, set `copy-server-schema` to true.

```js
ENV['ember-cashay'] = {
  'copy-server-schema': true
}
```


## Running tests

```
yarn install && bower install
yarn test
```


## Thank you!

This project is the glue, the real work was done on these incredible projects:

- [cashay](https://github.com/mattkrick/cashay) by [@mattkrick](https://github.com/mattkrick)
- [ember-redux](https://github.com/toranb/ember-redux) by [@toranb](https://github.com/toranb)
- [ember-cli-mirage](https://github.com/samselikoff/ember-cli-mirage) by [@samselikoff](https://github.com/samselikoff)
- and everyone who contributed to these projects and everyone at Facebook for giving us Redux and GraphQL!


## License

MIT
