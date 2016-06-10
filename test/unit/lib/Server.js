//imports
const assert = require("assert");
const justo = require("justo");
const suite = justo.suite;
const test = justo.test;
const init = justo.init;
const fin = justo.fin;
const validator = require("elisa-driver-validator");
const Driver = require("../../../dist/es5/nodejs/elisa-mysql").Driver;
const Server = require("../../../dist/es5/nodejs/elisa-mysql/lib/Server").default;
const config = require("../data/config");

//internal data
const cxOpts = (process.env.TRAVIS == "true" ? config.connection.travis : config.connection.me);
const name = "MySQL";

//suite
validator.validateServer("Server by Validator", {cxOpts, name});

suite("Server by MySQL Driver", function() {
  var drv, cx, svr;

  init({title: "Get driver"}, function() {
    drv = Driver.getDriver(name);
  });

  init({title: "Open connection and get server"}, function(done) {
    drv.openConnection(cxOpts, function(error, con) {
      cx = con;
      svr = cx.server;
      done();
    });
  });

  test("#version", function() {
    svr.version.must.be.instanceOf(String);
    svr.version.must.match(/.+\..+\..+.*/);
  });
})();
