"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
var _mysql = require("mysql");var _mysql2 = _interopRequireDefault(_mysql);
var _elisa = require("elisa");
var _Database = require("./Database");var _Database2 = _interopRequireDefault(_Database);
var _Server = require("./Server");var _Server2 = _interopRequireDefault(_Server);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _class = function (_Connection) {_inherits(_class, _Connection);function _class() {_classCallCheck(this, _class);return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));}_createClass(_class, [{ key: "getNamespaceClass", value: function getNamespaceClass() 








    {
      return require("./Namespace").default;} }, { key: "getServerClass", value: function getServerClass() 





    {
      return require("./Server").default;} }, { key: "getDatabaseClass", value: function getDatabaseClass() 





    {
      return require("./Database").default;} }, { key: "getStoreClass", value: function getStoreClass() 





    {
      return require("./Store").default;} }, { key: "getCollectionClass", value: function getCollectionClass() 





    {
      return require("./Collection").default;} }, { key: "_open", value: function _open(





    callback) {var _this2 = this;
      var opts = this.options;


      if (!callback) callback = function callback() {};
      if (!opts.host) opts.host = "localhost";
      if (!opts.port) opts.port = 3306;
      if (!opts.db) throw new Error("Database name expected.");


      Object.defineProperty(this, "client", { value: _mysql2.default.createConnection({ 
          host: opts.host, 
          port: opts.port, 
          database: opts.db, 
          user: opts.username, 
          password: opts.password }), 
        configurable: true });


      this.client.connect(function (err) {
        if (err) return callback(err);

        _this2.client.query("SELECT @@version as version;", function (err, rows) {
          if (err) return callback(err);

          _this2.options.version = rows[0].version;
          callback();});});} }, { key: "_close", value: function _close(







    callback) {var _this3 = this;
      if (this.opened) {
        this.client.end(function (error) {
          delete _this3.client;

          if (callback) {
            if (error) callback(error);else 
            callback();}});} else 


      {
        if (callback) process.nextTick(callback);}} }, { key: "_connected", value: function _connected(






    callback) {
      if (this.opened) this._ping(function (error) {callback(undefined, !error);});else 
      callback(undefined, false);} }, { key: "_ping", value: function _ping(





    callback) {
      if (this.opened) {
        this.client.query("SELECT 1;", function (error, rows) {
          if (error) callback(error);else 
          callback();});} else 

      {
        callback(new Error("Connection closed."));}} }]);return _class;}(_elisa.Connection);exports.default = _class;