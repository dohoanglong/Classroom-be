"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("./db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// constructor
var Customer = function Customer(customer) {
  this.email = customer.email;
  this.name = customer.name;
  this.active = customer.active;
};

Customer.create = function (newCustomer, result) {
  _db["default"].query("INSERT INTO customers SET ?", newCustomer, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", _objectSpread({
      id: res.insertId
    }, newCustomer));
    result(null, _objectSpread({
      id: res.insertId
    }, newCustomer));
  });
};

Customer.findById = function (customerId, result) {
  _db["default"].query("SELECT * FROM customers WHERE id = ".concat(customerId), function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    } // not found Customer with the id


    result({
      kind: "not_found"
    }, null);
  });
};

Customer.getAll = function (result) {
  _db["default"].query("SELECT * FROM customers", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};

Customer.updateById = function (id, customer, result) {
  _db["default"].query("UPDATE customers SET email = ?, name = ?, active = ? WHERE id = ?", [customer.email, customer.name, customer.active, id], function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({
        kind: "not_found"
      }, null);
      return;
    }

    console.log("updated customer: ", _objectSpread({
      id: id
    }, customer));
    result(null, _objectSpread({
      id: id
    }, customer));
  });
};

Customer.remove = function (id, result) {
  _db["default"].query("DELETE FROM customers WHERE id = ?", id, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({
        kind: "not_found"
      }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

Customer.removeAll = function (result) {
  _db["default"].query("DELETE FROM customers", function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("deleted ".concat(res.affectedRows, " customers"));
    result(null, res);
  });
};

var _default = Customer;
exports["default"] = _default;