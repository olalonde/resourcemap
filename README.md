# resourcemap

Resourceful routing for Express 4.x

## Install

```
npm install --save resourcemap
```

## Example

```javascript
var app = require('express')(),
  map = require('resourcemap')(app);

// Example user resource
// In real life, you probably want one resource per file
var resources = {
  user: {
    // GET /users
    index: function (req, res) {},

    // GET /users/new
    new: function (req, res) {},

    // POST /users
    create: function (req, res) {},

    // GET /users/:user
    show: function (req, res) {},

    // GET /users/:user/edit
    edit: function (req, res) {},

    // PUT /users/:user
    update: function (req, res) {},

    // DELETE /users/:user
    destroy: function (req, res) {}
  },

  /* more resources.... */

  // Singleton resource
  account: {
    // GET /account
    show: function (req, res) {},
    // GET /account/edit
    edit: function (req, res) {},
    // PUT /account
    update: function (req, res) {},
    // DELETE /account
    destroy: function (req, res) {}
  }
};

map.resources('user', resources.users, function (user) {
  // Child resource (routes are prefixed with `/users/:user`)
  // GET /users/:user/posts
  // GET /users/:user/posts/:post
  // etc.
  user.resources('post', resources.posts);
});

// You can specify the plural form of a resource
map.resources({ name: 'tx', plural: 'txs' }, resources.txs);

// Singleton resource
map.resource('account', resources.account);
```
