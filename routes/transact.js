const Transaction = require('../models/Transaction');
const UserDetails = require('../models/Use');
const express = require('express');
const router = express.Router();

router.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const {
      receiptno,
      transaction_date,
      userDetailsId,
      amountpaid,
      description
    } = req.body;

    try {
      const transaction = await Transaction.findByPk(id);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Fetch the user details from the UserDetails table
      const userDetails = await UserDetails.findByPk(userDetailsId);

      if (!userDetails) {
        return res.status(404).json({ error: 'User details not found' });
      }

      // Update the transaction data
      transaction.receiptno = receiptno;
      transaction.transaction_date = transaction_date;
      transaction.accountname = userDetails.accountname;
      transaction.accounttype = userDetails.accounttype;
      transaction.accountno = userDetails.accountno;
      transaction.amountpaid = amountpaid;
      transaction.description = description;
      transaction.incomegroupcode = incomegroupcode;

      await transaction.save();

      return res.json({ message: 'Transaction updated successfully' });
    } catch (error) {
      console.error('Error updating transaction:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/transactions', async (req, res) => {
    try {
      const transactions = await Transaction.findAll();
      console.log(transactions);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error retrieving transactions', error);
      res.status(500).json({ message: 'An error occurred while retrieving transactions' });
    }
  });

  router.post('/transactions', async (req, res) => {
    const {
      receiptno,
      transaction_date,
      userDetailsId,
      amountpaid,
      description,
      incomegroupcode,
    } = req.body;

    try {
      // Fetch the user details from the UserDetails table
      const userDetails = await UserDetails.findByPk(userDetailsId);

      if (!userDetails) {
        return res.status(404).json({ error: 'User details not found' });
      }

      // Create a new transaction
      const newTransaction = await Transaction.create({
        receiptno,
        transaction_date,
        accountname: userDetails.accountname,
        accounttype: userDetails.accounttype,
        accountno: userDetails.accountno,
        amountpaid,
        description,
        incomegroupcode
      });

      return res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;
