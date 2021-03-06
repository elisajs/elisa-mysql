"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _elisa = require("elisa");
var _Namespace = require("./Namespace");var _Namespace2 = _interopRequireDefault(_Namespace);
var _Store = require("./Store");var _Store2 = _interopRequireDefault(_Store);
var _Collection = require("./Collection");var _Collection2 = _interopRequireDefault(_Collection);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _class = function (_Database) {_inherits(_class, _Database);function _class() {_classCallCheck(this, _class);return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));}_createClass(_class, [{ key: "_findNamespace", value: function _findNamespace(








    name, opts, callback) {var _this2 = this;
      var sql;


      sql = "SELECT 1 FROM information_schema.tables WHERE table_schema = ? and table_name like concat(?, '._%')";


      this.client.query(sql, [this.name, name], function (err, res) {
        if (err) return callback(err);
        if (res.length > 0) callback(undefined, new _Namespace2.default(_this2, name, opts));else 
        callback();
      });
    } }, { key: "_findStore", value: function _findStore(




    name, opts, callback) {var _this3 = this;
      var sql;


      sql = "SELECT 1 FROM information_schema.tables WHERE table_schema = ? and table_name = ?";


      this.client.query(sql, [this.name, name], function (err, res) {
        if (err) return callback(err);

        if (res.length > 0) callback(undefined, new _Store2.default(_this3, name, opts));else 
        callback();
      });
    } }, { key: "_findCollection", value: function _findCollection(




    name, opts, callback) {var _this4 = this;
      var sql;


      sql = "SELECT 1 FROM information_schema.tables WHERE table_schema = ? and table_name = ?";


      this.client.query(sql, [this.name, name], function (err, res) {
        if (err) return callback(err);

        if (res.length > 0) callback(undefined, new _Collection2.default(_this4, name, opts));else 
        callback();
      });
    } }]);return _class;}(_elisa.Database);exports.default = _class;