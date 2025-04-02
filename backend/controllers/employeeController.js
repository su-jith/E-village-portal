// controllers/employeeController.js
exports.getEmployeeProfile = (req, res) => {
  // You can later extend this to fetch and return detailed employee data.
  res.json({ 
    msg: "Employee dashboard working!", 
    user: req.user  // This will show the employee's id and role from the JWT payload.
  });
};
