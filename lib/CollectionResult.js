//imports
import Result from "./Result";

/**
 * A collection result.
 */
export default class CollectionResult extends Result {
  /**
   * Constructor.
   */
  constructor(rows) {
    super([]);

    for (let row of rows) {
      let doc = row.doc.toString();

      //to JSON
      doc = JSON.parse(doc, function(key, value) {
        if (typeof(value) == "string" && value.startsWith("$")) {
          value = JSON.parse(value.substr(1));
        }

        return value;
      });

      //add id if needed
      if (row.hasOwnProperty("id")) doc.id = row.id;
      this.add(doc);
    }
  }
}
