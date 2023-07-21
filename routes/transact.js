const Transaction = require("../models/Transaction");
const UserDetails = require("../models/Use");
const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const moment = require("moment-timezone");


// Function to generate the PDF receipt with company logo and name
const generateReceiptPDF = (transactionData, companyName) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A6",
      });

      // Buffer to store the generated PDF
      const buffers = [];

      // Pipe the PDF document to the buffer
      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Set the font size for the company name
      doc.fontSize(14);

      const logoPath = path.join(__dirname, "Sacip.png");
      const logoWidth = 100;
      const logoHeight = 50;
      const logoX = doc.page.width / 2 - logoWidth / 2;
      const logoY = doc.y;
      doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });

      // Add space between logo and company name
      doc.moveDown(1);

      // Add company name to the PDF in the same line as the logo
      doc.text(`  SaCip Software Solutions`, { align: "center" });

      // Move down by 2 lines
      doc.moveDown(1);

      // Reset the font size for transaction details
      doc.fontSize(10);

      // Add transaction details to the PDF with line spacing
      doc.text(`Receipt No: ${transactionData.receiptno}`);
      doc.moveDown();
      doc.text(`Transaction Date: ${transactionData.transaction_date}`);
      doc.moveDown();
      doc.text(`Account Name: ${transactionData.accountname}`);
      doc.moveDown();
      doc.text(`Account No: ${transactionData.accountno}`);
      doc.moveDown();
      doc.text(`Amount Paid: ${transactionData.amountpaid}`);
      doc.moveDown();
      doc.text(`Description: ${transactionData.description}`);
      doc.moveDown();
      doc.text(`Income Group Code: ${transactionData.incomegroupcode}`);

      doc.end();
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

    const pdfBuffer = await generateReceiptPDF(latestTransaction, "Sacip");

    // Set the response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
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

    // Fetch the user details from the Uses table
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

    const currentDate = moment().tz("Africa/Lusaka").format("YYYY-MM-DD HH:mm:ss");

    const newTransaction = await Transaction.create({
      receiptno,
      transaction_date: currentDate,
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
