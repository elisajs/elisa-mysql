/**
 * Return the WHERE clause.
 */
export default function where(query, params) {
  var clause = "";

  //(1) build
  for (let field in query) {
    let predicate = "", value = query[field];

    if (["string", "boolean", "number"].indexOf(typeof(value)) >= 0 || value instanceof Array) {
      predicate = eq(field, "=", value);
    } else {
      let ops = Object.keys(value), filter = true;

      for (let op of ops) {
        if (!op.startsWith("$")) {
          filter = false;
          break;
        }
      }

      if (!filter) {
        predicate = eq(field, value);
      } else {
        for (let op of ops) {
          let expr = "";

          switch (op) {
            case "$eq": expr = eq(field, "=", value[op]); break;
            case "$ne": case "$neq": expr = eq(field, "<>", value[op]); break;
            case "$lt": expr = cmp(field, "<", value[op]); break;
            case "$le": case "$lte": expr = cmp(field, "<=", value[op]); break;
            case "$gt": expr = cmp(field, ">", value[op]); break;
            case "$ge": case "$gte": expr = cmp(field, ">=", value[op]); break;
            case "$between": expr = between(field, "BETWEEN", value[op]); break;
            case "$nbetween": case "$notBetween": expr = between(field, "NOT BETWEEN", value[op]); break;
            case "$like": expr = like(field, "LIKE", value[op]); break;
            case "$nlike": case "$notLike": expr = like(field, "NOT LIKE", value[op]); break;
            case "$contain": case "$contains": expr = contain(field, value[op]); break;
            case "$ncontain": case "$ncontains": case "$notContain": case "$notContains": expr = ncontain(field, value[op]); break;
            case "$in": expr = inn(field, "IN", value[op]); break;
            case "$nin": case "$notIn": expr = inn(field, "NOT IN", value[op]); break;
            default: throw new Error(`Invalid filter operator: ${op}.`);
          }

          predicate = expr;
        }
      }
    }

    if (clause === "") clause = predicate;
    else clause += " AND " + predicate;
  }

  //(2) return
  return (clause ? "WHERE " + clause : "");

  //helpers
  function eq(field, op, value) {
    var predicate;

    if (typeof(value) == "string") {
      if (field == "id") {
        predicate = `id ${op} ?`;
        params.push(value);
      } else {
        predicate = `column_get(doc, ? as char) ${op} ?`;
        params.push(field);
        params.push(value);
      }
    } else if (typeof(value) == "number") {
      if (field == "id") {
        predicate = `id ${op} ?`;
        params.push(value);
      } else {
        predicate = `column_get(doc, ? as decimal) ${op} ?`;
        params.push(field);
        params.push(value);
      }
    } else {
      if (field == "id") {
        predicate = `id ${op} ?`;
        params.push(value);
      } else {
        predicate = `column_get(doc, ? as char) ${op} ?`;
        params.push(field);
        params.push("$" + JSON.stringify(value));
      }
    }

    return predicate;
  }

  function cmp(field, op, value) {
    var predicate;

    if (field == "id") {
      predicate = `id ${op} ?`;
      params.push(value);
    } else {
      if (typeof(value) == "string") predicate = `column_get(doc, ? as char) ${op} ?`;
      else predicate = `column_get(doc, ? as decimal) ${op} ?`;
      params.push(field);
      params.push(value);
    }

    return predicate;
  }

  function between(field, op, value) {
    var predicate;

    if (field == "id") {
      predicate = `id ${op} ? AND ?`;
      params.push(value[0]);
      params.push(value[1]);
    } else {
      if (typeof(value) == "string") predicate = `column_get(doc, ? as char) ${op} ? AND ?`;
      else predicate = `column_get(doc, ? as char) ${op} ? AND ?`;
      params.push(field);
      params.push(value[0]);
      params.push(value[1]);
    }

    return predicate;
  }

  function like(field, op, value) {
    var predicate;

    if (field == "id") {
      predicate = `id ${op} ?`;
      params.push(value);
    } else {
      if (typeof(value) == "string") predicate = `column_get(doc, ? as char) ${op} ?`;
      else predicate = `column_get(doc, ? as char) ${op} ?`;

      params.push(field);
      params.push(value);
    }

    return predicate;
  }

  function inn(field, op, value) {
    var predicate;

    if (field == "id") {
      if (value.length === 0) {
        predicate = (op == "IN" ? "false" : "true");
      } else {
        predicate = `id ${op} (?)`;
        params.push(value);
      }
    } else {
      if (value.length === 0) {
        predicate = (op == "IN" ? "false" : "true");
      } else {
        predicate = `column_get(doc, ? as char) ${op} (?)`;
        params.push(field);
        params.push(value);
      }
    }

    return predicate;
  }

  function contain(field, value) {
    var predicate;

    if (field == "id") {
      predicate = "instr(id, ?)";
      params.push(value);
    } else {
      predicate = "if(left(@cv:=column_get(doc, ? as char), 1) <> '$', instr(@cv, ?), instr(@cv, ?))";
      params.push(field);
      params.push(value);
      params.push(JSON.stringify(value));
    }

    return predicate;
  }

  function ncontain(field, value) {
    var predicate;

    if (field == "id") {
      predicate = "(not instr(id, ?))";
      params.push(value);
    } else {
      predicate = "if(left(@cv:=column_get(doc, ? as char), 1) <> '$', not instr(@cv, ?), not instr(@cv, ?))";
      params.push(field);
      params.push(value);
      params.push(JSON.stringify(value));
    }

    return predicate;
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
