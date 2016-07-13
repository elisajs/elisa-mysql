//imports
import {Collection} from "elisa";
import {Updater} from "elisa-util";
import CollectionQuery from "./CollectionQuery";
import CollectionResult from "./CollectionResult";
import where from "./where";

//internal members
const insertDoc = Symbol();
const insertDocs = Symbol();

/**
 * A collection.
 *
 * On MySQL, this concept doesn't exist.
 */
export default class extends Collection {
  /**
   * @override
   */
  query() {
    return new CollectionQuery(this);
  }

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
  _findAll(opts, callback) {
    this.client.query(`SELECT id, column_json(doc) as doc FROM \`${this.qn}\``, function(err, rows) {
      if (err) return callback(err);
      callback(undefined, new CollectionResult(rows));
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
    var sql, params = [], fields = [];

    //(1) add params
    for (let col in doc) {
      let val = doc[col];

      if (["boolean", "object"].indexOf(typeof(val)) >= 0) val = "$" + JSON.stringify(val);

      if (col != "id") {
        fields.push(col);
        fields.push(val);
      }
    }

    if (doc.hasOwnProperty("id")) params.push(doc.id);
    params.push(fields);

    //(1) build SQL
    sql = `INSERT INTO \`${this.qn}\``;
    sql += (params.length == 1 ? "(doc)" : "(id, doc)");
    sql += "VALUES";
    sql += (params.length == 1 ? "(column_create(?))" : "(?, column_create(?))");

    //(2) run
    this.client.query(sql, params, function(err, res) {
      if (err) return callback(err);
      callback();
    });
  }

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
  _update(query, upd, opts, callback) {
    var sql, params = [];

    //(1) build SQL
    sql = `UPDATE \`${this.qn}\` ${set(upd, params)} ${where(query, params)}`;

    //(3) run
    this.client.query(sql, params, function(err) {
      if (err) return callback(err);
      callback();
    });
  }

  /**
   * @override
   */
  _save(doc, opts, callback) {
    var sql, params = [], fields = [];

    //(1) build SQL
    sql = `INSERT INTO \`${this.qn}\`(id, doc) VALUES(?, @doc:=column_create(?)) ON DUPLICATE KEY UPDATE doc=@doc`;

    params.push(doc.id);

    for (let col in doc) {
      let val = doc[col];

      if (col != "id") {
        if (["boolean", "object"].indexOf(typeof(val)) >= 0) val = "$" + JSON.stringify(val);
        fields.push(col);
        fields.push(val);
      }
    }

    params.push(fields);

    //(2) run
    this.client.query(sql, params, function(err, res) {
      if (err) return callback(err);
      callback();
    });
  }

  /**
   * @override
   */
  _remove(query, opts, callback) {
    var sql, params = [];

    //(1) build SQL
    sql = `DELETE FROM \`${this.qn}\` ${where(query, params)}`;

    //(2) run
    this.client.query(sql, params, function(err) {
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

/**
 * Return the UPDATE SET clause.
 */
function set(update, params) {
  var clause = "";

  //(1) build
  for (let field in update) {
    let predicate = "", value = update[field];

    if (["string", "boolean", "number"].indexOf(typeof(value)) >= 0) {
      predicate = assign(field, value);
    } else {
      let keys = Object.keys(value);

      if (keys.length == 1) {
        let op = keys[0];

        if (op == "$set") predicate = assign(field, value.$set);
        else if (op == "$inc") predicate = math("+", field, value.$inc);
        else if (op == "$dec") predicate = math("-", field, value.$dec);
        else if (op == "$mul") predicate = math("*", field, value.$mul);
        else if (op == "$div") predicate = math("/", field, value.$div);
        else if (op == "$add") predicate = add(field, value.$add);
        else if (op == "$remove") predicate = remove(field, value.$remove);
        else if (op == "$push") predicate = push(field, value.$push);
        else if (op == "$concat") predicate = concat(field, value.$concat);
        else if (op == "$pop") predicate = pop(field, value.$pop);
        else predicate = assign(field, value);
      } else {
        predicate = assign(field, value);
      }
    }

    if (clause === "") clause = predicate;
    else clause += ", " + predicate;
  }

  //(2) return
  return "SET " + clause;

  //helpers
  function assign(field, value) {
    var predicate;

    if (typeof(value) == "string") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push(value);
    } else if (typeof(value) == "boolean") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push("$" + value);
    } else if (typeof(value) == "number") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push(value);
    } else if (typeof(value) == "object") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push("$" + JSON.stringify(value));
    }

    return predicate;
  }

  function math(op, field, value) {
    params.push(field);
    params.push(value);

    return `doc = column_add(doc, @fld:=?, column_get(doc, @fld as decimal) ${op} ?)`;
  }

  function concat(field, value) {
    params.push(field);
    params.push(value);
    params.push(value);
    params.push(value);

    return `doc = column_add(doc, @fld:=?, if(not column_exists(doc, @fld), ?, if((@cv:=column_get(doc, @fld as char)) in ('', '$null'), ?, concat(@cv, ?))))`;
  }

  function push(field, value) {
    var item = JSON.stringify(value);

    params.push(field);
    params.push(item);
    params.push(item);
    params.push(item);

    return `doc = column_add(doc, @fld:=?, if(not column_exists(doc, @fld), concat('$[', ?, ']'), if((@cv:=column_get(doc, @fld as char)) in ('$[]', '$null'), concat('$[', ?, ']'), concat(left(@cv, length(@cv) - 1), ',', ?, ']'))))`;
  }

  function pop(field, value) {
    params.push(field);

    return `doc = if(not column_exists(doc, @fld:=?), doc, column_add(doc, @fld, if((@cv:=column_get(doc, @fld as char)) in ('$[]', '$null'), @cv, if(not instr(@cv, ','), '$[]', concat(substr(@cv, 1, length(@cv) - length(substring_index(@cv, ",", -1)) - 1), "]")))))`;
  }

  function add(field, value) {
    var item = JSON.stringify(value);

    params.push(field);
    params.push(item);
    params.push(item);
    params.push(item);

    return `doc = column_add(doc, @fld:=?, if(not column_exists(doc, @fld), concat('$[', ?, ']'), if((@cv:=column_get(doc, @fld as char)) in ('$[]', '$null'), concat('$[', ?, ']'), if(instr(@cv, @val:=?), @cv, concat(left(@cv, length(@cv)- 1), ',', @val, ']')))))`;
  }

  function remove(field, value) {
    var predicate = `doc = if(not column_exists(doc, (@fld:=?)), doc, if((@cv := column_get(doc, @fld as char)) in ('$null', '$[]'), doc, column_add(doc, @fld, replace(replace(regexp_replace(replace(@cv, ?, ''), ',+', ','), '$[,', '$['), ',]', ']'))))`;
    var item = JSON.stringify(value);

    params.push(field);
    params.push(item);

    return predicate;
  }
}
