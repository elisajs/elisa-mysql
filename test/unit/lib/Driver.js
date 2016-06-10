//imports
const assert = require("assert");
const justo = require("justo");
const suite = justo.suite;
const test = justo.test;
const init = justo.init;
const fin = justo.fin;
const validator = require("elisa-driver-validator");
const Driver = require("../../../dist/es5/nodejs/elisa-mysql").Driver;
const Connection = require("../../../dist/es5/nodejs/elisa-mysql/lib/Connection").default;
const config = require("../data/config");

//internal data
const cxOpts = (process.env.TRAVIS == "true" ? config.connection.travis : config.connection.me);
const name = "MySQL";

//suite
validator.validateDriver("Driver by Validator", {cxOpts, name});

suite("Driver by MySQL Driver", function() {
  var drv;

  init({title: "Get driver"}, function() {
    drv = Driver.getDriver(name);
  });

  suite("#createConnection()", function() {
    test("#createConnection(opts)", function() {
      var cx = drv.createConnection(cxOpts, config.connection.me);

      cx.must.be.instanceOf(Connection);
      cx.driver.must.be.same(drv);
      cx.options.must.have(["host", "port", "db", "username", "password"]);
      cx.opened.must.be.eq(false);
      cx.closed.must.be.eq(true);
    });
  });
})();
