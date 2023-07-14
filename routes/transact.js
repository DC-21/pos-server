const Transaction = require("../models/Transaction");
const UserDetails = require("../models/Use");
const express = require("express");
const PDFDocument = require('pdfkit');
const router = express.Router();

// Function to generate a PDF receipt
const generateReceiptPDF = (transactionData, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();

      // Set the response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="receipt.pdf"');

      // Pipe the PDF document to the response
      doc.pipe(res);

      // Add transaction details to the PDF
      doc.text(`Receipt No: ${transactionData.receiptno}`);
      doc.text(`Transaction Date: ${transactionData.transaction_date}`);
      // Add more transaction details as needed

      // Finalize the PDF and end the response
      doc.end();

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

router.get("/transactions/latest", async (req, res) => {
  try {
    const latestTransaction = await Transaction.findOne({
      order: [["id", "DESC"]],
    });

    if (!latestTransaction) {
      return res.status(404).json({ error: "No transaction found" });
    }

    // Generate the PDF receipt
    await generateReceiptPDF(latestTransaction, res);
  } catch (error) {
    console.error("Error generating PDF receipt:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const {
    receiptno,
    transaction_date,
    userDetailsId,
    amountpaid,
    description,
    incomegroupcode,
  } = req.body;

  try {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Fetch the user details from the UserDetails table
    const userDetails = await UserDetails.findByPk(userDetailsId);

    if (!userDetails) {
      return res.status(404).json({ error: "User details not found" });
    }

    // transaction data
    transaction.receiptno = receiptno;
    transaction.transaction_date = transaction_date;
    transaction.accountname = userDetails.accountname;
    transaction.accounttype = userDetails.accounttype;
    transaction.accountno = userDetails.accountno;
    transaction.amountpaid = amountpaid;
    transaction.description = description;
    transaction.incomegroupcode = incomegroupcode;

    await transaction.save();

    return res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
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
      return res.status(404).json({ error: "User details not found" });
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
      incomegroupcode,
    });

    return res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
