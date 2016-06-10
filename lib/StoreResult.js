//imports
import Result from "./Result";

/**
 * A store result.
 */
export default class extends Result {
  /**
   * Constructor.
   *
   * @param rows:object[] The rows.
   */
  constructor(rows) {
    super([]);

    for (let row of rows) {
      let doc = JSON.parse(row.value);
      doc.id = row.id;
      this.add(doc);
    }
  }
}
