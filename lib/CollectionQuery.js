//imports
import {CollectionQuery} from "elisa";
import CollectionResult from "./CollectionResult";
import where from "./where";

/**
 * A MySQL/MariaDB query.
 */
export default class extends CollectionQuery {
  /**
   * @override
   */
  _run(opts, callback) {
    var sql, params = [];

    //(1) build sql
    sql = "SELECT id, column_json(doc) as doc ";
    sql += `FROM \`${this.source.qn}\` `;
    sql += where(this.condition || {}, params) + " ";
    sql += orderBy(this.order, params) + " ";
    sql += limit(this.maxLimit, this.skip, params);

    //(2) run
    this.source.client.query(sql, params, function(err, rows) {
      if (err) return callback(err);
      callback(undefined, new CollectionResult(rows));
    });
  }
}

function limit(limit, offset, params) {
  var clause = "";

  if (limit) {
    clause = "LIMIT ?";
    params.push(limit);

    if (offset) {
      clause += " OFFSET ?";
      params.push(offset);
    }
  } else if (offset) {
    clause = "LIMIT ? OFFSET ?";
    params.push(999999999999999);
    params.push(offset);
  }

  return clause;
}

function orderBy(fields, params) {
  var clause = "";

  if (fields) {
    for (let field in fields) {
      var type = fields[field];

      if (field != "id") {
        params.push(field);
        field = `column_get(doc, ? as char)`;
      }

      clause += (clause !== "" ? ", " : "") + field + " " + type;
    }
  }

  return clause ? "ORDER BY " + clause : "";
}
