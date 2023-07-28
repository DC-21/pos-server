const router = require("express").Router();
const Customers = require('../models/Customer');
const axios = require("axios");

// Global variable to store the formatted data
let fetchedData = [];

router.get('/customers', async (req, res) => {
  try {
    const loginUrl = "http://23.254.128.117:7048/BusinessCentral140/ODataV4/Company('Mulonga%20Water%20Supply')/Customers";

    const username = 'WEBUSER';
    const password = 'Pass@123';

    // Encode the username and password in base64 and
    // Set the Authorization header with the encoded credentials
    const authCredentials = Buffer.from(`${username}:${password}`).toString('base64');

    const headers = {
      Authorization: `Basic ${authCredentials}`,
    };

    const dataResponse = await axios.get(loginUrl, { headers });
    const rawData = dataResponse.data.value;

    // Format the data into an array of objects with the necessary fields
    const formattedData = rawData.map(customer => ({
      customerNo: customer.No,
      name: customer.Name,
      address: customer.Address,
      address2: customer.Address_2,
      phoneNo: customer.Phone_No,
      balanceDueLCY: customer.Balance_Due_LCY,
    }));

    fetchedData = formattedData;

    console.log('Data fetched:', fetchedData);

    res.status(200).json({ message: 'Data fetched successfully.', data: fetchedData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
});

router.post('/customers', async (req, res) => {
  try {
    // Use the data stored in the global variable to save to the database
    console.log('Data to be saved:', fetchedData);

    // Check if there is data in the fetchedData array
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to save.' });
    }

    // Save the fetchedData array to the database using Sequelize bulkCreate
    await Customers.bulkCreate(fetchedData);

    // Clear the data in the global variable after saving to the database
    fetchedData = [];

    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'An error occurred while saving data.' });
  }
});

router.get("/customer-details", async (req, res) => {
  try {
    const customerData = await Customers.findAll();
    return res.json({ customerData });
  } catch (error) {
    console.error("Error fetching next receipt number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
