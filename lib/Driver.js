//imports
import {Driver} from "elisa";
import Connection from "./Connection";

/**
 * The MySQL Elisa driver.
 */
export default class MySQLDriver extends Driver {
  /**
   * Constructor.
   *
   * @private
   */
  constructor() {
    super("MySQL", ["MariaDB"]);
  }

  /**
   * @override
   */
  _createConnection(eliOpts, opts) {
    return new Connection(this, eliOpts, opts);
  }
}

Driver.register(new MySQLDriver());
