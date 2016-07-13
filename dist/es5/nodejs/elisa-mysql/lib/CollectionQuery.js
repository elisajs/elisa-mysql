"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _elisa = require("elisa");
var _CollectionResult = require("./CollectionResult");var _CollectionResult2 = _interopRequireDefault(_CollectionResult);
var _where = require("./where");var _where2 = _interopRequireDefault(_where);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _class = function (_CollectionQuery) {_inherits(_class, _CollectionQuery);function _class() {_classCallCheck(this, _class);return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));}_createClass(_class, [{ key: "_run", value: function _run(








    opts, callback) {
      var sql, params = [];


      sql = "SELECT id, column_json(doc) as doc ";
      sql += "FROM `" + this.source.qn + "` ";
      sql += (0, _where2.default)(this.condition || {}, params) + " ";
      sql += orderBy(this.order, params) + " ";
      sql += limit(this.maxLimit, this.skip, params);


      this.source.client.query(sql, params, function (err, rows) {
        if (err) return callback(err);
        callback(undefined, new _CollectionResult2.default(rows));
      });
    } }]);return _class;}(_elisa.CollectionQuery);exports.default = _class;


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
    for (var field in fields) {
      var type = fields[field];

      if (field != "id") {
        params.push(field);
        field = "column_get(doc, ? as char)";
      }

      clause += (clause !== "" ? ", " : "") + field + " " + type;
    }
  }

  return clause ? "ORDER BY " + clause : "";
}