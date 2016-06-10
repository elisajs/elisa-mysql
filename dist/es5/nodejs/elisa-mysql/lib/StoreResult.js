"use strict";Object.defineProperty(exports, "__esModule", { value: true });
var _Result2 = require("./Result");var _Result3 = _interopRequireDefault(_Result2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var _class = function (_Result) {_inherits(_class, _Result);










  function _class(rows) {_classCallCheck(this, _class);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, 
    []));var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

      for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var row = _step.value;
        var doc = JSON.parse(row.value);
        doc.id = row.id;
        _this.add(doc);}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}return _this;}return _class;}(_Result3.default);exports.default = _class;