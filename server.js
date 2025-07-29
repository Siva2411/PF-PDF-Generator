require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { sequelize } = require("./models");
const passbookRoutes = require("./routes/passbook");

const fetch = global.fetch;

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure output folder exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Middleware
app.use(bodyParser.json());
app.use("/api/passbook", passbookRoutes);
app.use(express.static(path.join(__dirname, "views")));

// Default route to serve form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pfGenerateForm.html"));
});

// PDF Generation Route
app.get(
  "/api/generate-passbook/:member_id/:financial_year",
  async (req, res) => {
    const { member_id, financial_year } = req.params;

    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const response = await fetch(
        `${baseUrl}/api/passbook/${member_id}/${financial_year}`
      );
      const result = await response.json();

      if (!result.success) {
        return res.status(404).send("Failed to fetch passbook data");
      }

      const data = result.data;

      const browser = await puppeteer.launch({
        headless: 'new', // or true
        executablePath: puppeteer.executablePath(), // automatically uses installed Chromium
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      const htmlFilePath = path.resolve(__dirname, "views", "pfTemplate.html");
      await page.goto(`file://${htmlFilePath}`, { waitUntil: "networkidle0" });

      await page.evaluate((passbookData) => {
        window.generatePassbook(passbookData);
      }, data);

      const pdfBuffer = await page.pdf({
        path: path.join(outputDir, "generated.pdf"),
        width: "290mm",
        height: "400mm",
        displayHeaderFooter: true,
        printBackground: true,
        footerTemplate: `
        <div style="width: 100%; font-size: 18px; padding: 0 15mm; color: #000; display: flex; justify-content: space-between;">
          <span>PYKRP269375005000</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
        margin: { top: "0px", right: "0px", bottom: "10px", left: "0px" },
      });

      await browser.close();
      const cleanMemberId = member_id.trim().replace(/\s+/g, "_");
      const cleanYear = financial_year.trim().replace(/\s+/g, "_");
      const fileName = `${cleanMemberId}_${cleanYear}.pdf`;

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
      });
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF Generation Error:", error.message);
      res.status(500).send("Error generating PDF");
    }
  }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("📦 Database synced");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at port number : ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB Sync failed:", error);
  });
