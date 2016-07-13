//imports
import {Database} from "elisa";
import Namespace from "./Namespace";
import Store from "./Store";
import Collection from "./Collection";

/**
 * A MySQL database.
 */
export default class extends Database {
  /**
   * @override
   */
  _findNamespace(name, opts, callback) {
    var sql;

    //(1) build query
    sql = "SELECT 1 FROM information_schema.tables WHERE table_schema = ? and table_name like concat(?, '._%')";

    //(2) run query
    this.client.query(sql, [this.name, name], (err, res) => {
      if (err) return callback(err);
      if (res.length > 0) callback(undefined, new Namespace(this, name, opts));
      else callback();
    });
  }

  /**
   * @override
   */
  _findStore(name, opts, callback) {
    var sql;

    //(1) build query
    sql = "SELECT 1 FROM information_schema.tables WHERE table_schema = ? and table_name = ?";

    //(2) run query
    this.client.query(sql, [this.name, name], (err, res) => {
      if (err) return callback(err);

      if (res.length > 0) callback(undefined, new Store(this, name, opts));
      else callback();
    });
  }

  /**
   * @override
   */
  _findCollection(name, opts, callback) {
    var sql;

    //(1) build query
    sql = "SELECT 1 FROM information_schema.tables WHERE table_schema = ? and table_name = ?";

    //(2) run query
    this.client.query(sql, [this.name, name], (err, res) => {
      if (err) return callback(err);

      if (res.length > 0) callback(undefined, new Collection(this, name, opts));
      else callback();
    });
  }
}
