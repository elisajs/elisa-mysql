//imports
const assert = require("assert");
const justo = require("justo");
const suite = justo.suite;
const test = justo.test;
const init = justo.init;
const fin = justo.fin;
const validator = require("elisa-driver-validator");
const config = require("../data/config");
const storeUtil = require("../util/store");

//internal data
const cxOpts = (process.env.TRAVIS == "true" ? config.connection.travis : config.connection.me);
const name = "MySQL";

//suite
validator.validateDatabase("Database by Validator", {
  cxOpts,
  name,
  createStores: storeUtil.createStores,
  dropStores: storeUtil.dropStores
});
