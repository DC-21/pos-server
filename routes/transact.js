const Transactions = require("../models/Transactions");
const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const moment = require("moment-timezone");

router.get('/transactions', async (req, res) => {
  try {
    const Trans = await Transactions.findAll();
    return res.json({ Trans });
  } catch (error) {
    console.log("error fetching transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      receiptno,
      date,
      name,
      customer_no,
      opening_bal,
      closing_bal,
      amount,
      payment_type,
      description,
      income_group_code,
    } = req.body;

    // Log the request body for debugging
    console.log("Request Body:", req.body);

    const Trans = await Transactions.create({
      receiptno,
      date,
      name,
      customer_no,
      opening_bal,
      closing_bal,
      amount,
      payment_type,
      description,
      income_group_code,
    });

    // Log the newTransaction for debugging
    console.log("New Transaction:", Trans);

    return res.json({ Trans });
  } catch (error) {
    console.log("error creating transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
