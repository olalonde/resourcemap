var _ = require('underscore'),
  debug = require('debug')('resourcemap'),
  inflection = require('inflection'),
  path = require('path');

function join (arr) {
  return path.join.apply(null, arr);
}

function map (app, context) {
  context = _.extend({
    basepath: '/'
  }, context);

  function generate_routes (opts, resource, is_singleton, cb) {
    if (typeof cb !== 'function') cb = function () {};

    if (typeof opts === 'string') {
      opts = { name: opts };
    }

    debug('Generating routes for' + (is_singleton ? ' singleton' : '') + ' ' + opts.name);

    if (!resource)
      throw new TypeError('Error creating ' + opts.name + ' route: no resource object passed');

    opts = _.extend({
      plural: is_singleton ? opts.name : inflection.pluralize(opts.name),
      id_param: is_singleton ? '' : ':' + opts.name
    }, opts);

    var collection_routes = is_singleton ? [] : [
      [ 'get',    '',     'index' ],
      [ 'get',    'new',  'new' ],
      [ 'post',   '',     'create' ]
    ].map(function (row) {
      return [ row[0], [ opts.plural, row[1] ], row[2] ];
    });

    var instance_routes = [
      [ 'get',    '',     'show' ],
      [ 'get',    'edit', 'edit' ],
      [ 'put',    '',     'update' ],
      [ 'post',   '',     'create' ],
      [ 'delete', '',     'destroy' ]
    ].map(function (row) {
      return [ row[0], [ opts.plural, opts.id_param, row[1] ], row[2] ];
    });

    var routes = collection_routes.concat(instance_routes).map(function (row) {
      return [ row[0], join([ context.basepath ].concat(row[1])), row[2] ];
    });

    var valid_routes = _.filter(routes, function (route) {
      if (typeof resource[route[2]] === 'function') return true;
      if (_.isArray(resource[route[2]])) return true;
    });


    _.each(valid_routes, function (route) {
      debug('app.' + route[0] + '(\'' + route [1] + '\', resourceobj.' + route[2] + ')');
      app[route[0]](route[1], resource[route[2]]);
    });

    // return created routes for debugging
    return valid_routes.concat(cb(map(app, {
      parent_context: context,
      basepath: join([ context.basepath, opts.plural, opts.id_param ])
    })) || []);
  }

  function resource (name, resource, cb) {
    return generate_routes(name, resource, true, cb);
  }

  function resources (name, resource, cb) {
    return generate_routes(name, resource, false, cb);
  }

  return {
    resource: resource,
    resources: resources
  };

};

module.exports = map;
