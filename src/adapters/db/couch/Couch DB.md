## Couch DB adapter

Currently uses [cradle](https://github.com/flatiron/cradle) Couch DB client.

Cradle has support for [Mango](https://github.com/cloudant/mango), which provides a MongoDB API layer for CouchDB.
We will use the Mango API to make it quick and easy to port the Mongo DB adapter to Couch DB.   

[Promisify Cradle with Bluebird promises](https://github.com/flatiron/cradle/issues/293)

We will use the [promised land](https://github.com/kristianmandrup/cradle/tree/promised-land) branch to 

*Promised Land* example:

```js
const cradle = require('cradle');
const client = // configure client
const db = // configure db from client

const P = require('bluebird')
const promisedLand = require('cradle/promised-land');
const promised = promisedLand(P.promisifyAll, {cradle, client, db});
```

You can now use the following promised enabled APIs as you see fit, even with async/await :)

```js
promised.db
promised.client
promised.cradle
```

## Schemas

CouchDB is schemaless, but perhaps we can add schema support to cradle!?

[schema-couch examples](https://github.com/ryanramage/schema-couch/tree/master/example/schemas)

Use my [refactored branch](https://github.com/kristianmandrup/schema-couch) 

```js
module.exports = {
    type: "object",
    additionalProperties: false, // ie. strict schema
    belongs_to: [
      {
        name: "quiz",
        type: "quiz",
        many_name: "submissions",
        foreign_key: "question_id",
        extra_keys: ["answer"]
      },
      {
        type: "user",
        many_name: "answers",
        foreign_key: "user_id"
      }
    ],
    properties: {
        answer: {
            type: "string",
            required: true
        },
        question_id: {
          type: "string",
          required: true
        },
        user_id: {
          type: "string",
          required: true
        }

    }
}
```