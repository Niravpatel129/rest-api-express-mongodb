const router = require("express").Router();
const cors = require("cors");

const employeeSchemaTemplate = require("../Models/employees.model");

const EmployeesDataBase = employeeSchemaTemplate;

router.use(cors());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};

let employeess;

function updateEmplyees() {
  EmployeesDataBase.find(function(err, employees) {
    if (err) {
      console.log(err);
    } else {
      employeess = employees;
    }
  });
}

updateEmplyees();

router.get("/employees", cors(corsOptions), (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.status(200);
  res.send(JSON.stringify(employeess, null, 2));
});

router.delete("/deleteEmployee", cors(corsOptions), (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  const employeeID = req.query.employeeId;

  EmployeesDataBase.deleteOne({
    _id: employeeID
  }).then(() => {
    updateEmplyees();
    res.sendStatus(200);
  });
});

router.route("/addEmployee").post((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const employeeInfo = req.body;
  const newEmployee = new EmployeesDataBase({
    id: employeeInfo.id,
    name: employeeInfo.name,
    code: employeeInfo.code,
    profession: employeeInfo.profession,
    color: employeeInfo.color,
    city: employeeInfo.city,
    branch: employeeInfo.branch,
    assigned: employeeInfo.assigned
  });

  newEmployee.save(function(err, employee) {
    if (err) {
      res.sendStatus(201);
      res.end();
    } else {
      updateEmplyees();
      res.sendStatus(200);
      console.log(employee.name + " added to the database!");
    }
  });
});

router.route("/updateEmployee").put((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const employeeInfo = req.body;

  EmployeesDataBase.findByIdAndUpdate(
    { _id: employeeInfo._id },
    {
      $set: {
        _id: employeeInfo._id,
        id: employeeInfo.id,
        name: employeeInfo.name,
        code: employeeInfo.code,
        profession: employeeInfo.profession,
        city: employeeInfo.city,
        branch: employeeInfo.branch,
        color: employeeInfo.color
      }
    }
  )
    .then(data => {
      updateEmplyees();
      res.sendStatus(200);
    })
    .catch(err => {
      res.sendStatus(201);
    });
});

router.route("/toggleAssigned").put(cors(corsOptions), (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  const employeeInfo = req.body;

  EmployeesDataBase.findByIdAndUpdate(
    { _id: employeeInfo._id },
    {
      $set: { assigned: req.body.toEnableOrDisable }
    }
  )
    .then(data => {
      updateEmplyees();
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/getHighestId", cors(corsOptions), (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  EmployeesDataBase.findOne()
    .sort({ id: -1 })
    .then(response => {
      console.log(response);
      res.send(JSON.stringify(response, null, 2));
    })
    .catch(err => console.log(err));
});

module.exports = router;
