const Transactions = require("../models/Transactions");
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const moment = require("moment-timezone");
const { Readable } = require("stream");

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

const generatePDFReceipt = (transactionData) => {
  const doc = new PDFDocument();
  const stream = new Readable();

  stream._read = () => {};

  // Define the left and right margin for the two columns
  const leftMargin = 50;
  const rightMargin = 300;

  // Function to add data to the left column
  const addToLeftColumn = (label, value) => {
    doc
      .fontSize(12)
      .text(label, leftMargin)
      .text(value, leftMargin, doc.y, { align: "right" });
  };

  // Function to add data to the right column
  const addToRightColumn = (label, value) => {
    doc
      .fontSize(12)
      .text(label, rightMargin)
      .text(value, rightMargin, doc.y, { align: "right" });
  };

  doc.fontSize(20).text("Receipt", { align: "center" });

  // Add data to the left column
  addToLeftColumn("Receipt No:", transactionData.rcptno);
  addToLeftColumn("Date:", transactionData.date);
  addToLeftColumn("Name:", transactionData.name);
  addToLeftColumn("Customer No:", transactionData.customer_no);
  addToLeftColumn("Opening Balance:", transactionData.opn_bal);
  addToLeftColumn("Amount:", transactionData.amount);
  addToLeftColumn("Amount Tendered:", transactionData.amt_tnd);
  addToLeftColumn("Payment Type:", transactionData.pymt_type);

  // Move to the right column
  doc.moveUp(doc.y - doc.page.margins.top).moveTo(rightMargin, doc.y);

  // Add data to the right column
  addToRightColumn("Closing Balance:", transactionData.clsn_bal);
  addToRightColumn("Change:", transactionData.change);
  addToRightColumn("Description:", transactionData.desc);
  addToRightColumn("Income Group Code:", transactionData.code);

  doc.end();

  return stream;
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

    // Create the new transaction in the database
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

    // Generate the PDF receipt using the new transaction data
    const pdfStream = generatePDFReceipt(newTransaction.toJSON());

    // Convert the PDF stream to a buffer
    let pdfBuffer = Buffer.from([]);
    pdfStream.on("data", (chunk) => {
      pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
    });

    pdfStream.on("end", () => {
      // Set the appropriate headers for the PDF response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${newTransaction.rcptno}.pdf`
      );

      // Send the PDF buffer in the response
      res.send(pdfBuffer);
    });
  } catch (error) {
    console.log("error creating transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
