import Customers from '../controllers/customer.controller.js';
import express from 'express';
var router = express.Router();
// Create a new Customer
const customers =new Customers();

router.post("/", customers.create);

// Retrieve all Customers
router.get("/", customers.findAll);

// Retrieve a single Customer with customerId
router.get("/:customerId", customers.findOne);

// Update a Customer with customerId
router.put("/:customerId", customers.update);

// Delete a Customer with customerId
router.delete("/:customerId", customers.delete);

// Create a new Customer
router.delete("/", customers.deleteAll);

export default router;