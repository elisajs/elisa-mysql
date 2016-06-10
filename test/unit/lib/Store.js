//imports
const assert = require("assert");
const justo = require("justo");
const suite = justo.suite;
const test = justo.test;
const init = justo.init;
const fin = justo.fin;
const validator = require("elisa-driver-validator");
const Driver = require("../../../dist/es5/nodejs/elisa-mysql").Driver;
const config = require("../data/config");
const util = require("../util/store");

//internal data
const cxOpts = (process.env.TRAVIS == "true" ? config.connection.travis : config.connection.me);
const name = "MySQL";

//suite
validator.validateStore("Store by Validator (store without namespace)", {
  type: "store",
  cxOpts,
  name,
  createStores: util.createStores,
  dropStores: util.dropStores
});

validator.validateStore("Store by Validator (ns.store)", {
  type: "ns.store",
  cxOpts,
  name,
  createStores: util.createStores,
  dropStores: util.dropStores
});
