"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Customer = _interopRequireDefault(require("../models/Customer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Create and Save a new Customer
var customer = function customer() {
  _classCallCheck(this, customer);

  _defineProperty(this, "create", function (req, res) {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    } // Create a Customer


    var _customer = new _Customer["default"]({
      email: req.body.email,
      name: req.body.name,
      active: req.body.active
    }); // Save Customer in the database


    _Customer["default"].create(_customer, function (err, data) {
      if (err) res.status(500).send({
        message: err.message || "Some error occurred while creating the Customer."
      });else res.send(data);
    });
  });

  _defineProperty(this, "findAll", function (req, res) {
    _Customer["default"].getAll(function (err, data) {
      if (err) res.status(500).send({
        message: err.message || "Some error occurred while retrieving customers."
      });else res.send(data);
    });
  });

  _defineProperty(this, "findOne", function (req, res) {
    _Customer["default"].findById(req.params.customerId, function (err, data) {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Customer with id ".concat(req.params.customerId, ".")
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Customer with id " + req.params.customerId
          });
        }
      } else res.send(data);
    });
  });

  _defineProperty(this, "update", function (req, res) {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    console.log(req.body);

    _Customer["default"].updateById(req.params.customerId, new _Customer["default"](req.body), function (err, data) {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Customer with id ".concat(req.params.customerId, ".")
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.customerId
          });
        }
      } else res.send(data);
    });
  });

  _defineProperty(this, "delete", function (req, res) {
    _Customer["default"].remove(req.params.customerId, function (err, data) {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Customer with id ".concat(req.params.customerId, ".")
          });
        } else {
          res.status(500).send({
            message: "Could not delete Customer with id " + req.params.customerId
          });
        }
      } else res.send({
        message: "Customer was deleted successfully!"
      });
    });
  });

  _defineProperty(this, "deleteAll", function (req, res) {
    _Customer["default"].removeAll(function (err, data) {
      if (err) res.status(500).send({
        message: err.message || "Some error occurred while removing all customers."
      });else res.send({
        message: "All Customers were deleted successfully!"
      });
    });
  });
};

var _default = customer;
exports["default"] = _default;