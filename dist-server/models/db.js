"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mysql = _interopRequireDefault(require("mysql"));

var _dbConfig = _interopRequireDefault(require("../config/db.config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Create a connection to the database
var connection = _mysql["default"].createConnection({
  host: _dbConfig["default"].HOST,
  user: _dbConfig["default"].USER,
  password: _dbConfig["default"].PASSWORD,
  database: _dbConfig["default"].DB
}); // open the MySQL connection


connection.connect(function (error) {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
var _default = connection;
exports["default"] = _default;