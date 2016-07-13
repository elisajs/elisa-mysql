"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _Result2 = require("./Result");var _Result3 = _interopRequireDefault(_Result2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 




CollectionResult = function (_Result) {_inherits(CollectionResult, _Result);



  function CollectionResult(rows) {_classCallCheck(this, CollectionResult);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CollectionResult).call(this, 
    []));var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

      for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var row = _step.value;
        var doc = row.doc.toString();


        doc = JSON.parse(doc, function (key, value) {
          if (typeof value == "string" && value.startsWith("$")) {
            value = JSON.parse(value.substr(1));
          }

          return value;
        });


        if (row.hasOwnProperty("id")) doc.id = row.id;
        _this.add(doc);
      }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}return _this;
  }return CollectionResult;}(_Result3.default);exports.default = CollectionResult;