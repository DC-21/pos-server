const express = require('express');
const sequelize = require('./utils/db');
const useRouter = require('./routes/routes');
const useTransact = require('./routes/transact');
const useCompany = require('./routes/company-routes');
const useIncome = require('./routes/income-groups');

const cors = require("cors");
const app = express();

// Configure bodyParser //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', useRouter);
app.use('/', useTransact);
app.use('/', useCompany);
app.use('/',useIncome);


// Error handling middleware to protect server from crashing //
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

//section to Test the database connection //
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync();

    app.listen(3000, () => {
      console.log('App listening on http://localhost:3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();