const router = require("express").Router();
const GLA = require("../models/GLAccounts");
const axios = require("axios");

// Global variable to store the formatted data
let fetchedData = [];

router.get('/gl-accounts', async (req, res) => {
  try {
    const loginUrl = "http://23.254.128.117:7048/BusinessCentral140/ODataV4/Company('Mulonga%20Water%20Supply')/GLAccounts";

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
    const formattedData = rawData.map(glaccounts => ({
      code: glaccounts.No,
      name: glaccounts.Name,
    }));

    fetchedData = formattedData;

    console.log('Data fetched:', fetchedData);

    res.status(200).json({ message: 'Data fetched successfully.', data: fetchedData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
});

router.post('/gl-accounts', async (req, res) => {
  try {
    // Use the data stored in the global variable to save to the database
    console.log('Data to be saved:', fetchedData);

    // Check if there is data in the fetchedData array
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to save.' });
    }

    // Save the fetchedData array to the database using Sequelize bulkCreate
    await GLA.bulkCreate(fetchedData);

    // Clear the data in the global variable after saving to the database
    fetchedData = [];

    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'An error occurred while saving data.' });
  }
});

router.put('/gl-accounts', async (req, res) => {
  try {
    // Check if there is data in the fetchedData array
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to update. Please fetch data first.' });
    }
    for (const glAccount of fetchedData) {
      const { code, name} = glAccount;
      const existingGlAccount = await GLA.findOne({
        where: {
          code: code,
        },
      });

      if (existingGlAccount) {
        await existingGlAccount.update({
          code: code,
          name: name,
        });
        console.log('GL accounts', code, 'updated successfully.');
      } else {
        console.log('GL accounts', code, 'not found in the database. Skipping.');
      }
    }

    fetchedData = [];

    res.status(200).json({ message: 'All G/L accounts updated successfully.' });
  } catch (error) {
    console.error('Error updating G/L accounts data:', error);
    res.status(500).json({ message: 'An error occurred while updating G/L accounts data.' });
  }
});

module.exports = router;
