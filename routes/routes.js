const router = require("express").Router();
const Customers = require('../models/Customer');
const axios = require("axios");

// Global variable to store the formatted data
let fetchedData = [];

//routes to fetch data from the OData end point and post,update the local database.//

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
    console.log('Data to be saved:', fetchedData);
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to save.' });
    }

    await Customers.bulkCreate(fetchedData);
    fetchedData = [];

    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'An error occurred while saving data.' });
  }
});

router.put('/customers', async (req, res) => {
  try {
    // Check if there is data in the fetchedData array
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to update. Please fetch data first.' });
    }
    for (const customerData of fetchedData) {
      const { customerNo, name, address, address2, phoneNo, balanceDueLCY } = customerData;
      const existingCustomer = await Customers.findOne({
        where: {
          customerNo: customerNo,
        },
      });

      if (existingCustomer) {
        await existingCustomer.update({
          name: name,
          address: address,
          address2: address2,
          phoneNo: phoneNo,
          balanceDueLCY: balanceDueLCY,
        });
        console.log('Customer', customerNo, 'updated successfully.');
      } else {
        console.log('Customer', customerNo, 'not found in the database. Skipping.');
      }
    }

    fetchedData = [];

    res.status(200).json({ message: 'All customers updated successfully.' });
  } catch (error) {
    console.error('Error updating customer data:', error);
    res.status(500).json({ message: 'An error occurred while updating customer data.' });
  }
});

//routes to be used on the frontend//

router.get("/customer-details", async (req, res) => {
  try {
    const customerData = await Customers.findAll();
    return res.json({ customerData });
  } catch (error) {
    console.error("Error fetching next receipt number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT route to update the balanceDueLCY of a customer
router.put('/customer-details/:customerNo', async (req, res) => {
  try {
    const customerNo = req.params.customerNo;
    const { newBalanceDueLCY } = req.body;

    // Check if the required parameters are provided
    if (!customerNo || !newBalanceDueLCY) {
      return res.status(400).json({ message: 'Please provide customerNo and newBalanceDueLCY.' });
    }

    // Find the customer by customerNo
    const customer = await Customers.findOne({ where: { customerNo } });

    // Check if the customer exists
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Update the balanceDueLCY field with the new value
    customer.balanceDueLCY = newBalanceDueLCY;

    // Save the updated customer to the database
    await customer.save();

    // Send a response with the updated customer
    return res.status(200).json({ message: 'Customer balanceDueLCY updated successfully.', customer });
  } catch (error) {
    console.error('Error updating customer balanceDueLCY:', error);
    return res.status(500).json({ message: 'An error occurred while updating customer balanceDueLCY.' });
  }
});

module.exports = router;
