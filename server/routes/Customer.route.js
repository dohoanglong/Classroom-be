import Customers from '../controllers/customer.controller.js';
import express from 'express';
var router = express.Router();
// Create a new Customer

router.post("/", Customers.create);

// Retrieve all Customers
router.get("/", Customers.findAll);

// Retrieve a single Customer with customerId
router.get("/:customerId", Customers.findOne);

// Update a Customer with customerId
router.put("/:customerId", Customers.update);

// Delete a Customer with customerId
router.delete("/:customerId", Customers.delete);

// Create a new Customer
router.delete("/", Customers.deleteAll);

export default router;