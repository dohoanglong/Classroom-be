"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _customerController = _interopRequireDefault(require("../controllers/customer.controller.js"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Create a new Customer


router.post("/", _customerController["default"].create); // Retrieve all Customers

router.get("/", _customerController["default"].findAll); // Retrieve a single Customer with customerId

router.get("/:customerId", _customerController["default"].findOne); // Update a Customer with customerId

router.put("/:customerId", _customerController["default"].update); // Delete a Customer with customerId

router["delete"]("/:customerId", _customerController["default"]["delete"]); // Create a new Customer

router["delete"]("/", _customerController["default"].deleteAll);
var _default = router;
exports["default"] = _default;