'use strict'
const Path = require('path')
const Async = require('async')
const Hoek = require('hoek')
const Glob = require('glob')

exports.register = function (server, options, next) {
  const globOptions = {
    nodir: true,
    strict: true,
    cwd: options.cwd || process.cwd()
  }

  Glob(options.routes, globOptions, (err, files) => {
    Hoek.assert(!err, err)
    Async.each(files, function (file, callback) {
      const path = Path.resolve(globOptions.cwd, file)
      const route = require(path)
      server.route(route.default || route)
      server.log(['hapi-auto-router', 'plugin'], 'Route File ' + file + ' loaded')
      return Hoek.nextTick(callback)()
    }, next)
  })

}


exports.register.attributes = {
    multiple: true,
    pkg: require('./package.json')
};
