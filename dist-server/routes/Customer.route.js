"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _customerController = _interopRequireDefault(require("../controllers/customer.controller.js"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Create a new Customer


var customers = new _customerController["default"]();
router.post("/", customers.create); // Retrieve all Customers

router.get("/", customers.findAll); // Retrieve a single Customer with customerId

router.get("/:customerId", customers.findOne); // Update a Customer with customerId

router.put("/:customerId", customers.update); // Delete a Customer with customerId

router["delete"]("/:customerId", customers["delete"]); // Create a new Customer

router["delete"]("/", customers.deleteAll);
var _default = router;
exports["default"] = _default;