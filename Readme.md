# Artifactor Adapters

*Artifact Adapters* for use by the Artifactor API:

- [artifactor-routes](https://github.com/kristianmandrup/artifactor-routes).
- [artifactor-sockets](https://github.com/kristianmandrup/artifactor-sockets) *coming soon*

### Install

`npm i artifactor-adapters --save`

## Development environment

Please see the `docs` folder, in particular `docs/env-setup/library-dev.md` 
which describes the full development environment, how it was configured etc.

### Run Test or Test suite

`npm test`

Write tests using either:
- [ava](https://github.com/ava/ava)
- or [mocha-test-dsl](https://www.npmjs.com/package/mocha-test-dsl) if you prefer using [mocha]

Note that Ava can use `spec` syntax via [ava-spec]()

- Ava testing framework: [ava](https://github.com/ava/ava)
- BDD: [ava-spec](https://www.npmjs.com/package/ava-spec)
- test doubles: [testdouble.js]()

## Adapters

Currently we are developing these adapters
- fake
- file
- db
  - mongo
  - couch

Use the `adapters/config.js` file to configure which adapters are active. 

### Fake adapter

To simulate a database full of artefacts we are introducing the Fake adapter.

It is based on the [json schema faker](json-schema-faker.js.org) which uses [faker.js](https://github.com/kristianmandrup/Faker.js/) to generate fake data based on a schema definitions.

This is a similar approach to Mongoose schemas. The fake data can also used to populate the various data stores, such as the database and file system etc.

See `faker/schemas` for the faker schemas:

```js
const schema = {
  type: 'object',
  required: [
    'name',
    'author',
    'version',
    'location',
    'status',
    'type',
    'keywords'
  ],
  properties: {
    name: {
      type: 'string',
      faker: 'random.word'
    },
    description: {
      type: 'string',
      faker: 'lorem.paragraph'
    },
    // more ....
  }
}
```

### DB adapter testing

To test the Mongo and Couch DB adapters, we need to first populate the DBs.
This should ideally be done via `beforeEach` and cleaned up in `afterEach` for each test suite:

To populate the DBs, add functions in `/src/data` for `/mongo/populate` and `/couch/populate` respectively!   

Currently we have a validation error when trying to use the components item reponse to create a DB model using the
Mongoose `Component` schema. 

## Switching adapter

Simply pass the `adapter` option either from `app.js` or in `bin/www` (or similar) as shown above:

 `var app = createApp({adapter: 'db'});`

### Fake adapter

Uses `faker` to generate fake responses. Useful for "quick and dirty" testing or generate fake realistic looking responses for any purpose ;) 

### File adapter

The `/responses` folder contains canned API responses in `.json` files for each artefact type.

The `io.js` can be used to access these files, f.ex via:
- `jsonItem(id)` - return specific artefact item
- `jsonList(id)` - return list of artefact items
- `files()` - return all artefact items (with full `versions` list for each item)

You can start playing with the API using these files, building up the test suite and then 
gradually switch to using Mongo DB schemas/models for the API. 

## Couch DB for Pouch DB (sync)

See `adapters/db/couch`

One of the main benefits of using Couch DB, is that we can then automatically sync with the client via Pouch DB 
and PouchDB/CouchDB combination also supports offline mode.

### Setup

See [setup couchdb](https://pouchdb.com/guides/setup-couchdb.html)

OSX: `$ brew install couchdb`

Once CouchDB is installed, it should be running at `localhost:5984`

`sudo couchdb`

### Add CORS

```bash
npm install -g add-cors-to-couchdb
add-cors-to-couchdb
```

## Mongo DB via Mongoose

See `adapters/db/mongo`

### Mac OSX - Mongo DB
Configuring Mongo DB. First install [homebrew](https://github.com/Homebrew/brew)

`$ brew install mongodb` 

Then run mongo deamon process

`$ mongod`

If it terminates with error `Data directory /data/db not found., terminating`: 
- create missing storage folder which holds databases
- set permissions

```
$ sudo mkdir -p /data/db/`
$ sudo chown -R `id -u` /data/db
```

Also see this gist: [ install-mongodb](https://gist.github.com/adamgibbons/cc7b263ab3d52924d83b)

### Models/Schemas

Mongoose DB Models and Schemas are configured in the `/db` folder. 
The `models.js` exports an object with entity models, each linked to a schema.
See [Mongoose models](http://mongoosejs.com/docs/models.html)

We can thus create instances of models as follows:

```js
const models = require('./db/models');
let components = {};
components.contacts = new models.Component({
  name: 'contacts', 
  // ...
})
```

## Promises

Just use bluebird if no native Promise ;)

`mongoose.Promise = global.Promise || require('bluebird');`

## Queries

[Mongoose Queries](http://mongoosejs.com/docs/queries.html)

"In mongoose 4, a Query has a `.then()` function, and thus can be used as a promise."

Mongoose queries are not promises. However, they do have a `.then()` function for yield and async/await. 
If you need a fully-fledged promise, use the `.exec()` function.

Mongoose async operations, like `.save()` and queries, return Promises/A+ conformant promises. 
This means that you can do things like `MyModel.findOne({}).then()` and `yield MyModel.findOne({}).exec()` 
(if you're using [co](https://github.com/tj/co) or async/await etc. via Babel).

Promises are returned from executed queries. Example:

```js
var query = Candy.find({ bar: true });
var promise = query.exec();
```

See [Switching out callbacks with promises in Mongoose](http://eddywashere.com/blog/switching-out-callbacks-with-promises-in-mongoose/)

### Save

```js
fluffy.save()
  .then(fluffy => fluffy.speak())
  .catch(err => console.error(err));
```

Say time goes by and we want to display all the kittens we've seen. We can access all of the kitten documents through our Kitten model.

```js
Kitten.find().exec()
  .then(kittens => console.log(kittens))
  .catch(err => console.error(err));
```

### Removing models

Models have a static `remove` method available for removing all documents matching conditions.

`Tank.remove({ size: 'large' }).exec().then(onSuccess).catch(onError)`

### Find by conditions

We just logged all of the kittens in our db to the console. If we want to filter our kittens by name, Mongoose supports MongoDBs rich querying syntax.

```js
Kitten.find({ name: /^fluff/ }).exec().then(onSuccess).catch(onErr);
```

### Find one and update

To update an artefact, use `findOneAndUpdate` as follows: 

`Component.findOneAndUpdate(query, update, {'upsert': true}).exec().then(onSuccess, onError);`

## File adapter

Currently the File adapter is designed to save and respond with canned responses from `.json` files from the `/responses` folder.

## License

MIT