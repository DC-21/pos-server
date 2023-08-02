const Transactions = require("../models/Transactions");
const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");

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

router.get("/generate-pdf", async (req, res) => {
  try {
    // Retrieve the most recent transaction from the database
    const mostRecentTransaction = await Transactions.findOne({
      order: [["id", "DESC"]], // Order by id in descending order
    });

    if (!mostRecentTransaction) {
      return res.status(404).json({ error: "No transactions found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());

    // Set the appropriate response headers for the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transaction.pdf"
    );

    // Pipe the PDF document directly to the response
    doc.pipe(res);

    doc.font("Helvetica-Bold");
    doc.fontSize(14);

    // Add styled data
    doc.text("Receipt", { align: "center" });

    doc.font("Helvetica");
    doc.fontSize(10);

    // Calculate the width of the columns
    const columnWidth = doc.page.width / 2;
    const leftMargin = 50;
    const rightMargin = doc.page.width / 2 + 50; // Adjust the right margin as needed

    // Define the vertical position for the lines
    let yPosition = doc.y;

    // Define the data for the left and right columns
    const leftData = [
      `Receipt No: ${mostRecentTransaction.rcptno}`,
      `Amount: ${mostRecentTransaction.amount}`,
      `Date: ${mostRecentTransaction.date}`,
      `Received: ${mostRecentTransaction.name}`,
      `Customer Number: ${mostRecentTransaction.customer_no}`,
      `Opening Balance: ${mostRecentTransaction.opn_bal}`,
      `Closing Balance: ${mostRecentTransaction.clsn_bal}`,
    ];

    const rightData = [
      `Amount Paid: ${mostRecentTransaction.amount}`,
      `Amount Tendered: ${mostRecentTransaction.amt_tnd}`,
      `Change: ${mostRecentTransaction.change}`,
      `Payment Type: ${mostRecentTransaction.pymt_type}`,
      `Being: ${mostRecentTransaction.desc}`,
      `Income Group Code: ${mostRecentTransaction.code}`,
    ];

    // Loop through the data and add text to both sides
    for (let i = 0; i < Math.max(leftData.length, rightData.length); i++) {
      if (i < leftData.length) {
        doc.text(leftData[i], leftMargin, yPosition, {
          align: "left",
        });
      }

      if (i < rightData.length) {
        doc.text(rightData[i], rightMargin, yPosition, {
          align: "left",
        });
      }

      yPosition += doc.currentLineHeight(true); // Move to the next line
    }

    // End the PDF document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


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

    // Log a success message after creating the transaction
    console.log("Transaction successfully created!");

    return res.json({ message: "Transaction successfully created!" });
  } catch (error) {
    console.log("Error creating transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
