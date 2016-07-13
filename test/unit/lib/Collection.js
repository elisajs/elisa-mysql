"use strict";

//imports
const mysql = require("mysql");
const assert = require("assert");
const justo = require("justo");
const suite = justo.suite;
const test = justo.test;
const init = justo.init;
const fin = justo.fin;
const validator = require("elisa-driver-validator");
const Driver = require("../../../dist/es5/nodejs/elisa-mysql").Driver;
const config = require("../data/config");

//internal data
const cxOpts = (process.env.TRAVIS == "true" ? config.connection.travis : config.connection.me);
const name = "MySQL";

//suite
validator.validateCollection("Collection by Validator (collection without namespace)", {
  type: "collection",
  cxOpts,
  name,
  createCollections,
  dropCollections
});

validator.validateCollection("Collection by Validator (ns.collection)", {
  type: "ns.collection",
  cxOpts,
  name,
  createCollections: createCollections,
  dropCollections: dropCollections
});

//helpers
function createCollections(cxOpts, colls, done) {
  const cx = mysql.createConnection({
    host: cxOpts.host,
    database: cxOpts.db,
    user: cxOpts.username,
    password: cxOpts.password
  });

  cx.connect(function(err) {
    if (err) return done(err);

    (function createCollection(i) {

      if (i < colls.length) {
        let coll = colls[i], name = coll.name, docs = coll.docs;

        cx.query(`CREATE TABLE \`${name}\`(id VARCHAR(256) PRIMARY KEY, doc BLOB NOT NULL)`, function(err) {
          if (err) return done(err);

          if (docs && docs.length > 0) {
            var params, sql, id, doc;

            id = docs[0].id;
            doc = Object.assign({}, docs[0]);
            delete doc.id;

            sql = `INSERT INTO \`${name}\`(id, doc) VALUES(?, column_create(?))`;
            params = [id, [
              "origin", doc.origin,
              "year", doc.year,
              "disbanded", "$" + doc.disbanded,
              "active", "$" + doc.active,
              "tags", "$" + JSON.stringify(doc.tags)
            ]];

            for (let doc of docs.slice(1)) {
              sql += ",(?, column_create(?))";
              id = doc.id;
              let value = Object.assign({}, doc);
              delete value.id;
              params.push(id);
              params.push([
                "origin", doc.origin,
                "year", doc.year,
                "disbanded", "$" + doc.disbanded,
                "active", "$" + doc.active,
                "tags", "$" + JSON.stringify(doc.tags)
              ]);
            }

            cx.query(sql, params, function(err) {
              if (err) return done(err);
              createCollection(i + 1);
            });
          } else {
            createCollection(i + 1);
          }
        });
      } else {
        cx.end(done);
      }
    })(0);
  });
}

function dropCollections(cxOpts, colls, done) {
  const cx = mysql.createConnection({
    host: cxOpts.host,
    database: cxOpts.db,
    user: cxOpts.username,
    password: cxOpts.password
  });

  cx.connect(function(err) {
    if (err) return done(err);

    (function dropCollection(i) {
      if (i < colls.length) {
        let coll = colls[i];

        cx.query(`DROP TABLE IF EXISTS \`${coll}\``, function(err) {
          if (err) return done(err);
          dropCollection(i + 1);
        });
      } else {
        cx.end(done);
      }
    })(0);
  });
}
