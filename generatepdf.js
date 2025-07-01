const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Absolute path to your local HTML file
  const htmlFilePath = path.resolve(__dirname, "templates", "pfTemplate.html");
  await page.goto(`file://${htmlFilePath}`, { waitUntil: "networkidle0" });

  // Generate PDF
  await page.pdf({
    path: "./output/generated.pdf",
    width: "290mm",
    height: "400mm",
    displayHeaderFooter: true,
    printBackground: true,
    footerTemplate: `
    <div style="width: 100%; font-size: 16px; padding: 0 10mm; color: #000; display: flex; justify-content: space-between;">
      <span>PYKRP269375005000</span>
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    </div>
    `,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });
  console.log("✅ PDF generated successfully!");
  await browser.close();
})();
