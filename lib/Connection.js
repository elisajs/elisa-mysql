//imports
import mysql from "mysql";
import {Connection} from "elisa";
import Database from "./Database";
import Server from "./Server";

/**
 * A MySQL connection.
 */
export default class extends Connection {
  /**
   * @override
   */
  getNamespaceClass() {
    return require("./Namespace").default;
  }

  /**
   * @override
   */
  getServerClass() {
    return require("./Server").default;
  }

  /**
   * @override
   */
  getDatabaseClass() {
    return require("./Database").default;
  }

  /**
   * @override
   */
  getStoreClass() {
    return require("./Store").default;
  }

  /**
   * @override
   */
  getCollectionClass() {
    return require("./Collection").default;
  }

  /**
   * @override
   */
  _open(callback) {
    var opts = this.options;

    //(1) pre
    if (!callback) callback = function() {};
    if (!opts.host) opts.host = "localhost";
    if (!opts.port) opts.port = 3306;
    if (!opts.db) throw new Error("Database name expected.");

    //(2) create MySQL connection
    Object.defineProperty(this, "client", {value: mysql.createConnection({
      host: opts.host,
      port: opts.port,
      database: opts.db,
      user: opts.username,
      password: opts.password,
    }), configurable: true});

    //(3) open
    this.client.connect((err) => {
      if (err) return callback(err);

      this.client.query("SELECT @@version as version;", (err, rows) => {
        if (err) return callback(err);

        this.options.version = rows[0].version;
        callback();
      });
    });
  }

  /**
   * @override
   */
  _close(callback) {
    if (this.opened) {
      this.client.end((error) => {
        delete this.client;

        if (callback) {
          if (error) callback(error);
          else callback();
        }
      });
    } else {
      if (callback) process.nextTick(callback);
    }
  }

  /**
   * @override
   */
  _connected(callback) {
    if (this.opened) this._ping(function(error) { callback(undefined, !error); });
    else callback(undefined, false);
  }

  /**
   * @override
   */
  _ping(callback) {
    if (this.opened) {
      this.client.query("SELECT 1;", function(error, rows) {
        if (error) callback(error);
        else callback();
      });
    } else {
      callback(new Error("Connection closed."));
    }
  }
}
