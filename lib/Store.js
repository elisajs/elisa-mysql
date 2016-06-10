//imports
import {Store} from "elisa";
import {Updater} from "elisa-util";
import Result from "./StoreResult";

//internal data
const update = new Updater().update;

//private members
const insertDoc = Symbol();
const insertDocs = Symbol();

/**
 * A store.
 *
 * On MySQL, this concept doesn't exist. It is simulated using a table
 * with two columns: id and value.
 */
export default class extends Store {
  /**
   * @override
   */
  _hasId(id, callback) {
    this.client.query(`SELECT * FROM \`${this.qn}\` WHERE id = ?`, [id], function(err, rows) {
      if (err) return callback(err);
      callback(undefined, rows.length > 0);
    });
  }

  /**
   * @override
   */
  _count(opts, callback) {
    this.client.query(`SELECT count(*) as count FROM \`${this.qn}\``, function(err, rows) {
      if (err) return callback(err);
      callback(undefined, rows[0].count);
    });
  }

  /**
   * @override
   */
  _findOne(query, opts, callback) {
    var sql, params = [];

    //(1) build query
    sql = `SELECT * FROM \`${this.qn}\``;
    if (query && "id" in query) params.push(query.id), sql += " WHERE id = ?";
    sql += " LIMIT 1";

    //(2) run query
    this.client.query(sql, params, function(err, rows) {
      if (err) return callback(err);

      if (rows.length === 0) {
        callback();
      } else {
        let doc = JSON.parse(rows[0].value);
        doc.id = query.id;
        callback(undefined, doc);
      }
    });
  }

  /**
   * @override
   */
  _findAll(opts, callback) {
    this.client.query(`SELECT * FROM \`${this.qn}\``, function(err, rows) {
      if (err) return callback(err);
      callback(undefined, new Result(rows));
    });
  }

  /**
   * @override
   */
  _insert(docs, opts, callback) {
    if (docs instanceof Array) this[insertDocs](docs, opts, callback);
    else this[insertDoc](docs, opts, callback);
  }

  [insertDoc](doc, opts, callback) {
    var sql, id, value;

    //(1) get id and value
    id = doc.id;
    doc = Object.assign({}, doc);
    delete doc.id;
    value = JSON.stringify(doc);

    //(2) run
    sql = `INSERT INTO \`${this.qn}\` SET ? ON DUPLICATE KEY UPDATE ?`;

    this.client.query(sql, [{id, value}, {value}], function(err, res) {
      if (err) return callback(err);
      callback();
    });
  }

  //TODO: all in an INSERT statement
  [insertDocs](docs, opts, callback) {
    const insert = (i) => {
      if (i < docs.length) {
        this[insertDoc](docs[i], opts, (error) => {
          if (error) return callback(error);
          insert(i+1);
        });
      } else {
        callback();
      }
    };

    insert(0);
  }

  /**
   * @override
   */
  _update(query, updt, opts, callback) {
    this._findOne({id: query.id}, {}, (err, doc) => {
      if (err) return callback(err);

      if (doc) {
        update(doc, updt);
        this._insert(doc, opts, function(err) {
          if (err) return callback(err);
          callback();
        });
      } else {
        callback();
      }
    });
  }

  /**
   * @override
   */
  _remove(query, opts, callback) {
    this.client.query(`DELETE FROM \`${this.qn}\` WHERE id = ?`, [query.id], function(err) {
      if (err) return callback(err);
      callback();
    });
  }

  /**
   * @override
   */
  _truncate(opts, callback) {
    this.client.query(`TRUNCATE \`${this.qn}\``, function(err) {
      if (err) return callback(err);
      callback();
    });
  }
}
