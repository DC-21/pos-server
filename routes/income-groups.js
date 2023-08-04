const router = require("express").Router();
const IncomeGroups = require('../models/Income_group_code');
const axios = require("axios");

// Global variable to store the formatted data
let fetchedData = [];

router.get('/income-group-codes', async (req, res) => {
  try {
    const loginUrl = "http://23.254.128.117:7048/BusinessCentral140/ODataV4/Company('Mulonga%20Water%20Supply')/IncomeGroups";

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
    const formattedData = rawData.map(incomegroups => ({
      code: incomegroups.Code,
      name: incomegroups.Name,
    }));

    fetchedData = formattedData;

    console.log('Data fetched:', fetchedData);

    res.status(200).json({ message: 'Data fetched successfully.', data: fetchedData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'An error occurred while fetching data.' });
  }
});

router.post('/income-group-codes', async (req, res) => {
  try {
    // Use the data stored in the global variable to save to the database
    console.log('Data to be saved:', fetchedData);

    // Check if there is data in the fetchedData array
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to save.' });
    }

    // Save the fetchedData array to the database using Sequelize bulkCreate
    await IncomeGroups.bulkCreate(fetchedData);

    // Clear the data in the global variable after saving to the database
    fetchedData = [];

    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'An error occurred while saving data.' });
  }
});

router.put('/income-group-codes', async (req, res) => {
  try {
    // Check if there is data in the fetchedData array
    if (fetchedData.length === 0) {
      return res.status(400).json({ message: 'No data to update. Please fetch data first.' });
    }
    for (const incomeGroupCode of fetchedData) {
      const { code, name} = incomeGroupCode;
      const existingIncomeGroupCode = await IncomeGroups.findOne({
        where: {
          code: code,
        },
      });

      if (existingIncomeGroupCode) {
        await existingIncomeGroupCode.update({
          code: code,
          name: name,
        });
        console.log('Income Group Codes', code, 'updated successfully.');
      } else {
        console.log('Income Group Codes', code, 'not found in the database. Skipping.');
      }
    }

    fetchedData = [];

    res.status(200).json({ message: 'All income group codes updated successfully.' });
  } catch (error) {
    console.error('Error updating income group codes data:', error);
    res.status(500).json({ message: 'An error occurred while updating G/L accounts data.' });
  }
});


router.get('/income-groupcodes', async(req,res)=>{
  try{
    const codes = await IncomeGroups.findAll();
    return res.json({codes});
  }catch (error) {
    console.error("Error fetching income group codes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
})
module.exports = router;
