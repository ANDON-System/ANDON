const express = require("express");
const { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getAllEmployees);
router.post("/", addEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
