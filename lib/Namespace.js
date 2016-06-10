//imports
import {Namespace} from "elisa";
import Store from "./Store";

/**
 * A MySQL namespace.
 * This object really doesn't exist in MySQL.
 */
export default class extends Namespace {
  /**
   * @override
   */
  _findStore(name, opts, callback) {
    var sql;

    //(1) build query
    sql = "SELECT 1 FROM information_schema.tables WHERE table_name = ?";

    //(2) run query
    this.client.query(sql, [this.getQn(name)], (err, res) => {
      if (err) return callback(err);

      if (res.length > 0) callback(undefined, new Store(this, name, opts));
      else callback();
    });
  }
}
