'use strict'
const Path = require('fs')
const Async = require('async')
const Glob = require('glob')

exports.register = function (server, options, next) {
  const globOptions = {
    nodir: true,
    strict: true,
    cwd: options.cwd || process.cwd(),
    ignore: options.ignore
  }

  Glob(options.routes, globOptions, (err, files) => {
    Hoek.assert(!err, err)
    Async.each(files, function (file, callback) {
      const path = Path.resolve(globOptions.cwd, file)
      const route = require(path)
      server.route(route.default || route)
      server.log(['auto-router', 'plugin'], 'Route `' + path + '` loaded')
      return Hoek.nextTick(callback)()
    }, next)
  })

}


exports.register.attributes = {
    multiple: true,
    pkg: require('./package.json')
};
