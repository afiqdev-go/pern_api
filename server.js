const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const bcrypt = require("bcryptjs");

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());


app.use(express.json());


app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const { where } = require("sequelize");
db.sequelize.sync()
  .then(() => {
    console.log('Drop and Resync Db');
    db.users.findOne({ where: { email: "admin1@gmail.com" } }).then(user => {
      if (!user) {
        initial();
      }
    })
  })
  .catch((err) => {
    console.log(err);
  });

  function initial() {
    db.users.create({
      "id":2,
      "name": "admin",
      "email":"admin1@gmail.com",
      "password":bcrypt.hashSync("admin12345", 8),
      "role":"admin"
    })
  }

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/course.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/episode.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});