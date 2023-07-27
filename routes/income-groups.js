const router = require('express').Router();
const Income = require('../models/Income');

router.get('/income-groups', async (req, res) => {
    try {
        const income = await Income.findAll();
        console.log(income);
        res.status(200).json(income);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'An error occurred while retrieving users.' });
    }
});

router.post('/income-groups', async (req, res) => {
    try {
        const income = req.body;

        const newIncome = await Income.create(income);

        res.status(201).json({ message: 'User created successfully.', income: newIncome });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'An error occurred while creating user.' });
    }
});

module.exports = router;