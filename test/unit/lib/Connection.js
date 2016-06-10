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
validator.validateConnection("Connection by Validator", {cxOpts, name});
