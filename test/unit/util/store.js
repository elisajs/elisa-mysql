//directives
"use strict";

//imports
const mysql = require("mysql");

//api
module.exports = {
  createStores,
  dropStores
};

//functions
function createStores(cxOpts, stores, done) {
  const cx = mysql.createConnection({
    host: cxOpts.host,
    database: cxOpts.db,
    user: cxOpts.username,
    password: cxOpts.password
  });

  cx.connect(function(err) {
    if (err) return done(err);

    (function createStore(i) {
      if (i < stores.length) {
        let store = stores[i], name = store.name, docs = store.docs;

        cx.query(`CREATE TABLE \`${name}\`(id VARCHAR(256) PRIMARY KEY, value TEXT NOT NULL)`, function(err) {
          if (err) return done(err);

          if (docs && docs.length > 0) {
            var params, sql, id, value;

            id = docs[0].id;
            value = Object.assign({}, docs[0]);
            delete value.id;

            sql = `INSERT INTO \`${name}\`(id, value) VALUES(?)`;
            params = [[id, JSON.stringify(value)]];
            for (let doc of docs.slice(1)) {
              sql += ",(?)";
              id = doc.id;
              value = Object.assign({}, doc);
              delete value.id;
              params.push([id, JSON.stringify(value)]);
            }

            cx.query(sql, params, function(err) {
              if (err) return done(err);
              createStore(i + 1);
            });
          } else {
            createStore(i + 1);
          }
        });
      } else {
        cx.end(done);
      }
    })(0);
  });
}

function dropStores(cxOpts, stores, done) {
  const cx = mysql.createConnection({
    host: cxOpts.host,
    database: cxOpts.db,
    user: cxOpts.username,
    password: cxOpts.password
  });

  cx.connect(function(err) {
    if (err) return done(err);

    (function dropStore(i) {
      if (i < stores.length) {
        let store = stores[i];

        cx.query(`DROP TABLE IF EXISTS \`${store}\``, function(err) {
          if (err) return done(err);
          dropStore(i + 1);
        });
      } else {
        cx.end(done);
      }
    })(0);
  });
}
