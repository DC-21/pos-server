const express = require('express');
const router = express.Router();
const CompanyData = require('../models/Company-data');

router.get('/company', async(req,res)=>{
    try{
        const companies = await CompanyData.findAll();
        console.log(companies);
        res.status(200).json(companies);
    } catch(error){
        console.error('Error retrieving companies:', error);
        res.status(500).json({ message: 'an error occurred while retrieving company details'});
    }
});

router.post('/company', async(req,res)=>{
    try{
        const companyDetails = req.body;
        const newCompany = await CompanyData.create(companyDetails);
        res.status(201).json({ message: 'User created successfully.', user: newCompany });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'An error occurred while creating user.' });
      }
})

module.exports = router;