const Transactions = require("../models/Transactions");
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const PDFTable = require("voilab-pdf-table");
const blobStream = require("blob-stream");
const moment = require("moment-timezone");
const numberToWords = require("number-to-words");

// Function to generate the next receipt number
const generateNextReceiptNumber = async () => {
  try {
    // Query the transactions table to get the latest transaction
    const latestTransaction = await Transactions.findOne({
      order: [["id", "DESC"]],
    });

    // If there are no transactions yet, start with RCT-800
    let latestReceiptNumber = 800;

    // If there is a latest transaction, extract the receipt number and increment it
    if (latestTransaction) {
      const receiptNoParts = latestTransaction.rcptno.split("-");
      const lastReceiptNumber = parseInt(receiptNoParts[1]);
      if (!isNaN(lastReceiptNumber)) {
        latestReceiptNumber = lastReceiptNumber + 1;
      }
    }

    // Return the generated receipt number
    return `RCT-${latestReceiptNumber.toString().padStart(6, "0")}`;
  } catch (error) {
    console.error("Error generating receipt number:", error);
    throw error;
  }
};

router.get("/receiptno", async (req, res) => {
  try {
    const nextReceiptNumber = await generateNextReceiptNumber();
    return res.json({ receiptNumber: nextReceiptNumber });
  } catch (error) {
    console.error("Error generating next receipt number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const Trans = await Transactions.findAll();
    return res.json({ Trans });
  } catch (error) {
    console.log("error fetching transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      rcptno,
      date,
      name,
      customer_no,
      opn_bal,
      clsn_bal,
      amount,
      amt_tnd,
      change,
      pymt_type,
      desc,
      code,
    } = req.body;

    // Log the request body for debugging
    console.log("Request Body:", req.body);

    const newTransaction = await Transactions.create({
      rcptno,
      date,
      name,
      customer_no,
      opn_bal,
      clsn_bal,
      amount,
      amt_tnd,
      change,
      pymt_type,
      desc,
      code,
    });

    // Log the newTransaction for debugging
    console.log("New Transaction:", newTransaction);

    // Log a success message after creating the transaction
    console.log("Transaction successfully created!");

    return res.json({ message: "Transaction successfully created!" });
  } catch (error) {
    console.log("Error creating transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/transactions/:id", async (req, res) => {
  const transactionId = req.params.id;

  try {
    const [numUpdatedRows] = await Transactions.update(
      { closed: true, Post: true },
      { where: { id: transactionId } } // Add the where clause here
    );

    if (numUpdatedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.json({ message: 'Closed status updated successfully' });
  } catch (error) {
    console.error('Error updating closed status:', error);
    return res.status(500).json({ message: 'Error updating closed status' });
  }
});

module.exports = router;
