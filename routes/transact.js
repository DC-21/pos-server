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
router.get("/generate-pdf", async (req, res) => {
  try {
    const mostRecentTransaction = await Transactions.findOne({
      order: [["id", "DESC"]],
    });

    if (!mostRecentTransaction) {
      return res.status(404).json({ error: "No transactions found" });
    }

    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transaction.pdf"
    );

    doc.font("Helvetica-Bold");
    doc.fontSize(10);

    doc.text("Receipt", { align: "center" });

    doc.font("Helvetica");
    doc.fontSize(9);

    function numberToWordsCustom(number) {
      const words = numberToWords.toWords(number);
      return words.charAt(0).toUpperCase() + words.slice(1).replace(/-/g, " ");
    }

    const amountInWords = numberToWordsCustom(mostRecentTransaction.amount);
    const data = [
      {
        col1: `Received:`,
        col2: `${mostRecentTransaction.name}`,
        col3: `Date:`,
        col4: moment(mostRecentTransaction.date).format(
          "ddd MMM DD YYYY HH:mm:ss"
        ),
      },
      {
        col1: `Sum of:`,
        col2: `${amountInWords} Kwacha`,
        col3: `Amount:`,
        col4: `${mostRecentTransaction.amount}`,
      },
      {
        col1: `Being:`,
        col2: `${mostRecentTransaction.desc}`,
        col3: `Payment Type:`,
        col4: `${mostRecentTransaction.pymt_type}`,
      },
      {
        col1: `Being:`,
        col2: `${mostRecentTransaction.desc}`,
        col3: `Payment Type:`,
        col4: `${mostRecentTransaction.pymt_type}`,
      },
      {
        col1: `Being:`,
        col2: `${mostRecentTransaction.desc}`,
        col3: `Payment Type:`,
        col4: `${mostRecentTransaction.pymt_type}`,
      },
    ];

    const table = new PDFTable(doc, { bottomMargin: 30 });
    const columnWidth = 110;

    table
      .addColumns([
        { id: "col1", width: columnWidth },
        { id: "col2", width: columnWidth },
        { id: "col3", width: columnWidth },
        { id: "col4", width: columnWidth },
      ])
      .onPageAdded(function (tb) {
        tb.columns.forEach((col) => (col.width = columnWidth));
      });

    doc.lineGap(8);
    data.forEach((row) => {
      table.addBody([
        {
          col1: row.col1,
          col2: row.col2,
          col3: row.col3,
          col4: row.col4,
        },
      ]);
    });
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
