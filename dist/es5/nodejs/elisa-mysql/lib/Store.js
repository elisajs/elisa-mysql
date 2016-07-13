"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _elisa = require("elisa");
var _elisaUtil = require("elisa-util");
var _StoreResult = require("./StoreResult");var _StoreResult2 = _interopRequireDefault(_StoreResult);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}


var update = new _elisaUtil.Updater().update;


var insertDoc = Symbol();
var insertDocs = Symbol();var _class = function (_Store) {_inherits(_class, _Store);function _class() {_classCallCheck(this, _class);return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));}_createClass(_class, [{ key: "_hasId", value: function _hasId(











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
    } }, { key: "_findOne", value: function _findOne(




    query, opts, callback) {
      var sql, params = [];


      sql = "SELECT * FROM `" + this.qn + "`";
      if (query && "id" in query) params.push(query.id), sql += " WHERE id = ?";
      sql += " LIMIT 1";


      this.client.query(sql, params, function (err, rows) {
        if (err) return callback(err);

        if (rows.length === 0) {
          callback();
        } else {
          var doc = JSON.parse(rows[0].value);
          doc.id = query.id;
          callback(undefined, doc);
        }
      });
    } }, { key: "_findAll", value: function _findAll(




    opts, callback) {
      this.client.query("SELECT * FROM `" + this.qn + "`", function (err, rows) {
        if (err) return callback(err);
        callback(undefined, new _StoreResult2.default(rows));
      });
    } }, { key: "_insert", value: function _insert(




    docs, opts, callback) {
      if (docs instanceof Array) this[insertDocs](docs, opts, callback);else 
      this[insertDoc](docs, opts, callback);
    } }, { key: 

    insertDoc, value: function value(doc, opts, callback) {
      var sql, id, value;


      id = doc.id;
      doc = Object.assign({}, doc);
      delete doc.id;
      value = JSON.stringify(doc);


      sql = "INSERT INTO `" + this.qn + "` SET ? ON DUPLICATE KEY UPDATE ?";

      this.client.query(sql, [{ id: id, value: value }, { value: value }], function (err, res) {
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




    query, updt, opts, callback) {var _this3 = this;
      this._findOne({ id: query.id }, {}, function (err, doc) {
        if (err) return callback(err);

        if (doc) {
          update(doc, updt);
          _this3._insert(doc, opts, function (err) {
            if (err) return callback(err);
            callback();
          });
        } else {
          callback();
        }
      });
    } }, { key: "_save", value: function _save(




    doc, opts, callback) {
      var sql, id, value;


      id = doc.id;
      doc = Object.assign({}, doc);
      delete doc.id;
      value = JSON.stringify(doc);


      sql = "INSERT INTO `" + this.qn + "` SET ? ON DUPLICATE KEY UPDATE ?";

      this.client.query(sql, [{ id: id, value: value }, { value: value }], function (err, res) {
        if (err) return callback(err);
        callback();
      });
    } }, { key: "_remove", value: function _remove(




    query, opts, callback) {
      this.client.query("DELETE FROM `" + this.qn + "` WHERE id = ?", [query.id], function (err) {
        if (err) return callback(err);
        callback();
      });
    } }, { key: "_truncate", value: function _truncate(




    opts, callback) {
      this.client.query("TRUNCATE `" + this.qn + "`", function (err) {
        if (err) return callback(err);
        callback();
      });
    } }]);return _class;}(_elisa.Store);exports.default = _class;