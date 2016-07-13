"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _elisa = require("elisa");
var _elisaUtil = require("elisa-util");
var _CollectionQuery = require("./CollectionQuery");var _CollectionQuery2 = _interopRequireDefault(_CollectionQuery);
var _CollectionResult = require("./CollectionResult");var _CollectionResult2 = _interopRequireDefault(_CollectionResult);
var _where = require("./where");var _where2 = _interopRequireDefault(_where);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}


var insertDoc = Symbol();
var insertDocs = Symbol();var _class = function (_Collection) {_inherits(_class, _Collection);function _class() {_classCallCheck(this, _class);return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));}_createClass(_class, [{ key: "query", value: function query() 










    {
      return new _CollectionQuery2.default(this);
    } }, { key: "_hasId", value: function _hasId(




    id, callback) {
      this.client.query("SELECT * FROM `" + this.qn + "` WHERE id = ?", [id], function (err, rows) {
        if (err) return callback(err);
        callback(undefined, rows.length > 0);
      });
    } }, { key: "_count", value: function _count(




    opts, callback) {
      this.client.query("SELECT count(*) as count FROM `" + this.qn + "`", function (err, rows) {
        if (err) return callback(err);
        callback(undefined, rows[0].count);
      });
    } }, { key: "_findAll", value: function _findAll(




    opts, callback) {
      this.client.query("SELECT id, column_json(doc) as doc FROM `" + this.qn + "`", function (err, rows) {
        if (err) return callback(err);
        callback(undefined, new _CollectionResult2.default(rows));
      });
    } }, { key: "_insert", value: function _insert(




    docs, opts, callback) {
      if (docs instanceof Array) this[insertDocs](docs, opts, callback);else 
      this[insertDoc](docs, opts, callback);
    } }, { key: 

    insertDoc, value: function value(doc, opts, callback) {
      var sql, params = [], fields = [];


      for (var col in doc) {
        var val = doc[col];

        if (["boolean", "object"].indexOf(typeof val === "undefined" ? "undefined" : _typeof(val)) >= 0) val = "$" + JSON.stringify(val);

        if (col != "id") {
          fields.push(col);
          fields.push(val);
        }
      }

      if (doc.hasOwnProperty("id")) params.push(doc.id);
      params.push(fields);


      sql = "INSERT INTO `" + this.qn + "`";
      sql += params.length == 1 ? "(doc)" : "(id, doc)";
      sql += "VALUES";
      sql += params.length == 1 ? "(column_create(?))" : "(?, column_create(?))";


      this.client.query(sql, params, function (err, res) {
        if (err) return callback(err);
        callback();
      });
    } }, { key: 

    insertDocs, value: function value(docs, opts, callback) {var _this2 = this;
      var insert = function insert(i) {
        if (i < docs.length) {
          _this2[insertDoc](docs[i], opts, function (error) {
            if (error) return callback(error);
            insert(i + 1);
          });
        } else {
          callback();
        }
      };

      insert(0);
    } }, { key: "_update", value: function _update(




    query, upd, opts, callback) {
      var sql, params = [];


      sql = "UPDATE `" + this.qn + "` " + set(upd, params) + " " + (0, _where2.default)(query, params);


      this.client.query(sql, params, function (err) {
        if (err) return callback(err);
        callback();
      });
    } }, { key: "_save", value: function _save(




    doc, opts, callback) {
      var sql, params = [], fields = [];


      sql = "INSERT INTO `" + this.qn + "`(id, doc) VALUES(?, @doc:=column_create(?)) ON DUPLICATE KEY UPDATE doc=@doc";

      params.push(doc.id);

      for (var col in doc) {
        var val = doc[col];

        if (col != "id") {
          if (["boolean", "object"].indexOf(typeof val === "undefined" ? "undefined" : _typeof(val)) >= 0) val = "$" + JSON.stringify(val);
          fields.push(col);
          fields.push(val);
        }
      }

      params.push(fields);


      this.client.query(sql, params, function (err, res) {
        if (err) return callback(err);
        callback();
      });
    } }, { key: "_remove", value: function _remove(




    query, opts, callback) {
      var sql, params = [];


      sql = "DELETE FROM `" + this.qn + "` " + (0, _where2.default)(query, params);


      this.client.query(sql, params, function (err) {
        if (err) return callback(err);
        callback();
      });
    } }, { key: "_truncate", value: function _truncate(




    opts, callback) {
      this.client.query("TRUNCATE `" + this.qn + "`", function (err) {
        if (err) return callback(err);
        callback();
      });
    } }]);return _class;}(_elisa.Collection);exports.default = _class;





function set(update, params) {
  var clause = "";


  for (var field in update) {
    var predicate = "", value = update[field];

    if (["string", "boolean", "number"].indexOf(typeof value === "undefined" ? "undefined" : _typeof(value)) >= 0) {
      predicate = assign(field, value);
    } else {
      var keys = Object.keys(value);

      if (keys.length == 1) {
        var op = keys[0];

        if (op == "$set") predicate = assign(field, value.$set);else 
        if (op == "$inc") predicate = math("+", field, value.$inc);else 
        if (op == "$dec") predicate = math("-", field, value.$dec);else 
        if (op == "$mul") predicate = math("*", field, value.$mul);else 
        if (op == "$div") predicate = math("/", field, value.$div);else 
        if (op == "$add") predicate = add(field, value.$add);else 
        if (op == "$remove") predicate = remove(field, value.$remove);else 
        if (op == "$push") predicate = push(field, value.$push);else 
        if (op == "$concat") predicate = concat(field, value.$concat);else 
        if (op == "$pop") predicate = pop(field, value.$pop);else 
        predicate = assign(field, value);
      } else {
        predicate = assign(field, value);
      }
    }

    if (clause === "") clause = predicate;else 
    clause += ", " + predicate;
  }


  return "SET " + clause;


  function assign(field, value) {
    var predicate;

    if (typeof value == "string") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push(value);
    } else if (typeof value == "boolean") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push("$" + value);
    } else if (typeof value == "number") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push(value);
    } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object") {
      predicate = "doc = column_add(doc, ?, ?)";
      params.push(field);
      params.push("$" + JSON.stringify(value));
    }

    return predicate;
  }

  function math(op, field, value) {
    params.push(field);
    params.push(value);

    return "doc = column_add(doc, @fld:=?, column_get(doc, @fld as decimal) " + op + " ?)";
  }

  function concat(field, value) {
    params.push(field);
    params.push(value);
    params.push(value);
    params.push(value);

    return "doc = column_add(doc, @fld:=?, if(not column_exists(doc, @fld), ?, if((@cv:=column_get(doc, @fld as char)) in ('', '$null'), ?, concat(@cv, ?))))";
  }

  function push(field, value) {
    var item = JSON.stringify(value);

    params.push(field);
    params.push(item);
    params.push(item);
    params.push(item);

    return "doc = column_add(doc, @fld:=?, if(not column_exists(doc, @fld), concat('$[', ?, ']'), if((@cv:=column_get(doc, @fld as char)) in ('$[]', '$null'), concat('$[', ?, ']'), concat(left(@cv, length(@cv) - 1), ',', ?, ']'))))";
  }

  function pop(field, value) {
    params.push(field);

    return "doc = if(not column_exists(doc, @fld:=?), doc, column_add(doc, @fld, if((@cv:=column_get(doc, @fld as char)) in ('$[]', '$null'), @cv, if(not instr(@cv, ','), '$[]', concat(substr(@cv, 1, length(@cv) - length(substring_index(@cv, \",\", -1)) - 1), \"]\")))))";
  }

  function add(field, value) {
    var item = JSON.stringify(value);

    params.push(field);
    params.push(item);
    params.push(item);
    params.push(item);

    return "doc = column_add(doc, @fld:=?, if(not column_exists(doc, @fld), concat('$[', ?, ']'), if((@cv:=column_get(doc, @fld as char)) in ('$[]', '$null'), concat('$[', ?, ']'), if(instr(@cv, @val:=?), @cv, concat(left(@cv, length(@cv)- 1), ',', @val, ']')))))";
  }

  function remove(field, value) {
    var predicate = "doc = if(not column_exists(doc, (@fld:=?)), doc, if((@cv := column_get(doc, @fld as char)) in ('$null', '$[]'), doc, column_add(doc, @fld, replace(replace(regexp_replace(replace(@cv, ?, ''), ',+', ','), '$[,', '$['), ',]', ']'))))";
    var item = JSON.stringify(value);

    params.push(field);
    params.push(item);

    return predicate;
  }
}