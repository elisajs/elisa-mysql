//imports
import {Server} from "elisa";

/**
 * A MySQL instance.
 */
export default class extends Server {
  /**
   * Constructor.
   *
   * @param(attr) connection
   */
  constructor(connection) {
    super(connection);

    Object.defineProperty(this, "host", {value: connection.options.host, enumerable: true});
    Object.defineProperty(this, "port", {value: connection.options.port, enumerable: true});
    Object.defineProperty(this, "version", {value: connection.options.version, enumerable: true});
  }
}
