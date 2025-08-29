// Dynamic data population functions
function populatePassbook(data) {
  let total;
  // Populate member information
  populateMemberInfo(data.memberInfo);

  // Populate EPF table
  populateEPFTable(data.epfData);

  // Populate taxable data table
  populateTaxableTable(data.taxableData);
}

function populateMemberInfo(memberInfo) {
  const infoHtml = `
                <div class="info-row">
                    <span class="info-label">
                        <span class="label-hindi">स्थापना आईडी / नाम</span>
                        <span class="separator"></span>
                        <span class="label-english">Establishment ID/Name</span>
                    </span>
                    <span class="info-value">${memberInfo.establishmentId} / ${memberInfo.establishmentName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">
                        <span class="label-hindi">सदस्य आईडी / नाम</span>
                        <span class="separator"></span>
                        <span class="label-english">Member ID/Name</span>
                    </span>
                    <span class="info-value">${memberInfo.memberId} / ${memberInfo.memberName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">
                        <span class="label-hindi">जन्म तिथि</span>
                        <span class="separator"></span>
                        <span class="label-english">Date of Birth</span>
                    </span>
                    <span class="info-value">${memberInfo.dateOfBirth}</span>
                </div>
                <div class="info-row" style="margin-bottom: 24px;">
                    <span class="info-label">
                        <span class="label-hindi">यू ए एन</span>
                        <span class="separator"></span>
                        <span class="label-english">UAN</span>
                    </span>
                    <span class="info-value">${memberInfo.uan}</span>
                </div>
            `;
  document.getElementById("memberInfo").innerHTML = infoHtml;
  document.getElementById("memberInfo2").innerHTML = infoHtml;
}

function populateEPFTable(epfData) {
  // Set table caption
  document.getElementById(
    "tableCaption"
  ).innerHTML = `<span class="hindi-label">ईपीएफ पासबुक [ वित्तीय वर्ष - ${epfData.financialYear} ] </span>
         <span style="
    font-size: 24px;
    font-weight: bold;
    vertical-align: middle;
    display: inline-block;
    line-height: 1;
  ">/</span>
        <span class="english-label">EPF Passbook [ Financial Year - ${epfData.financialYear} ]</span>
      `;
  // Set table header
  const headerHtml = `
                <tr>
                    <th colspan="6" style="text-align: left">विवरण / <span>Particulars</span></th>
                    <th style="text-align: right">कर्मचारी शेष / <br /><span>Employee Balance</span></th>
                    <th style="text-align: right">नियोक्ता शेष / <br /><span>Employer Balance</span></th>
                    <th style="text-align: right">पेंशन शेष / <br /><span>Pension Balance</span></th>
                </tr>
            `;
  document.getElementById("tableHeader").innerHTML = headerHtml;

  // Generate table body
  let bodyHtml = "";

  // Opening balance
  if (epfData.openingBalance) {
    bodyHtml += `
                    <tr class="opening-balance">
                        <td colspan="6" style="text-align: left">${
                          epfData.openingBalance.description
                        }</td>
                        <td class="amount">${formatAmount(
                          epfData.openingBalance.employeeBalance
                        )}</td>
                        <td class="amount">${formatAmount(
                          epfData.openingBalance.employerBalance
                        )}</td>
                        <td class="amount">${formatAmount(
                          epfData.openingBalance.pensionBalance
                        )}</td>
                    </tr>
                `;
  }

  // Sub headers for transactions
  bodyHtml += `
                <tr>
                    <th rowspan="2" style="text-align: center; vertical-align: middle">वेतन माह / <br />Wage Month</th>
                    <th colspan="2" style="text-align: center">लेनदेन / Transaction</th>
                    <th rowspan="2" style="text-align: center; vertical-align: middle">विवरण / Particulars</th>
                    <th colspan="2" style="text-align: center">वेतन / Wages</th>
                    <th colspan="3" style="text-align: center">अंशदान / Contribution</th>
                </tr>
                <tr>
                    <th style="text-align: center">दिनांक / Date</th>
                    <th style="text-align: center">प्रकार / Type</th>
                    <th style="text-align: center">ई.पी.एफ / EPF</th>
                    <th style="text-align: center">ई.पी.एस / EPS</th>
                    <th style="text-align: center">कर्मचारी / <br />Employee</th>
                    <th style="text-align: center">नियोक्ता / <br />Employer</th>
                    <th style="text-align: center">पेंशन / <br />Pension</th>
                </tr>
            `;

  // Transaction rows
  epfData.transactions.forEach((transaction) => {
    bodyHtml += `
                    <tr class="transaction-row">
                        <td style="text-align: right">${
                          transaction.wageMonth
                        }</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.type}</td>
                        <td class="particulars-col">${
                          transaction.particulars
                        }</td>
                        <td class="amount">${formatAmount(
                          transaction.epfWage
                        )}</td>
                        <td class="amount">${formatAmount(
                          transaction.epsWage
                        )}</td>
                        <td class="amount">${formatAmount(
                          transaction.employeeContribution
                        )}</td>
                        <td class="amount">${formatAmount(
                          transaction.employerContribution
                        )}</td>
                        <td class="amount">${formatAmount(
                          transaction.pensionContribution
                        )}</td>
                    </tr>
                `;
  });

  // Summary rows
  if (epfData.totalContributions) {
    bodyHtml += `
                    <tr class="total-row">
                        <td colspan="6" class="aggregate-col">
                          <strong>Total Contributions for the year [ ${
                            epfData.year
                          } ]
                        </strong>
                        </td>
                        <td class="amount">
                          <strong>${formatAmount(
                            epfData.totalContributions.employee
                          )}</strong>
                        </td>
                        <td class="amount">
                          <strong>
                            ${formatAmount(epfData.totalContributions.employer)}
                          </strong>
                        </td>
                        <td class="amount">
                          <strong>
                          ${formatAmount(epfData.totalContributions.pension)}
                          </strong>
                        </td>
                    </tr>
                `;
  }

  if (epfData.totalTransfers) {
    bodyHtml += `
                    <tr class="total-row">
                        <td colspan="6" class="aggregate-col"><strong>Total Transfer-Ins/VDRs for the year [ ${
                          epfData.year
                        } ]</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          epfData.totalTransfers.employee
                        )}</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          epfData.totalTransfers.employer
                        )}</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          epfData.totalTransfers.pension
                        )}</strong></td>
                    </tr>
                `;
  }

  if (epfData.totalWithdrawals) {
    bodyHtml += `
                    <tr class="withdrawal-row">
                        <td colspan="6" class="aggregate-col"><strong>Total Withdrawals for the year [ ${
                          epfData.year
                        } ]</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          epfData.totalWithdrawals.employee
                        )}</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          epfData.totalWithdrawals.employer
                        )}</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          epfData.totalWithdrawals.pension
                        )}</strong></td>
                    </tr>
                `;
  }

  if (epfData.interestUpdated) {
    bodyHtml += `
                    <tr class="interest-row">
                        <td colspan="6" style="text-align:left">${
                          epfData.interestUpdated.description
                        }</td>
                        <td class="amount">${formatAmount(
                          epfData.interestUpdated.employee
                        )}</strong></td>
                        <td class="amount">${formatAmount(
                          epfData.interestUpdated.employer
                        )}</td>
                        <td class="amount">${formatAmount(
                          epfData.interestUpdated.pension
                        )}</td>
                    </tr>
                `;
  }

  if (epfData.closingBalance) {
    bodyHtml += `
    <tr class="closing-balance">
      <td colspan="6" style="text-align:left; font-weight: bold;">
        ${epfData.closingBalance.description}
      </td>
      <td class="amount" style="font-weight: bold;">
        ${formatAmount(epfData.closingBalance.employee)}
      </td>
      <td class="amount" style="font-weight: bold;">
        ${formatAmount(epfData.closingBalance.employer)}
      </td>
      <td class="amount" style="font-weight: bold;">
        ${formatAmount(epfData.closingBalance.pension)}
      </td>
    </tr>
  `;
  }

  document.getElementById("tableBody").innerHTML = bodyHtml;
}

function populateTaxableTable(taxableData) {
  // Generate table body
  let bodyHtml = "";

  //set table caption
  bodyHtml += `<tr class="passbook-title" id="taxableCaption">
            <td colspan="4">Taxable Data for the year [ ${taxableData.financialYear} ]</td>
          </tr>`;

  // Opening balance
  if (taxableData.openingBalance) {
    bodyHtml += `
                    <tr class="opening-balance">
                        <td class="particulars-col">${
                          taxableData.openingBalance.description
                        }</td>
                        <td class="amount">${formatAmount(
                          taxableData.openingBalance.monthlyContribution
                        )}</td>
                        <td class="amount">${formatAmount(
                          taxableData.openingBalance.nonTaxable
                        )}</td>
                        <td class="amount">${formatAmount(
                          taxableData.openingBalance.taxable
                        )}</td>
                    </tr>
                `;
  }
  // Set table header
  bodyHtml += `
                <tr>
                    <th rowspan="2" style="text-align: left; vertical-align: middle">Cont.Month</th>
                    <th rowspan="2" style="text-align: left">Monthly Contribution</th>
                    <th colspan="2" style="text-align: center; vertical-align: middle">Cummulative Balance at the end of the month</th>
                </tr>
                <tr>
                    <th style="text-align: right">Non-Taxable</th>
                    <th style="text-align: right">Taxable</th>
                </tr>
            `;
  // Transaction rows
  taxableData.transactions.forEach((transaction) => {
    bodyHtml += `
                    <tr class="transaction-row">
                        <td>${transaction.month}</td>
                        <td class="amount">${formatAmount(
                          transaction.monthlyContribution
                        )}</td>
                        <td class="amount">${formatAmount(
                          transaction.nonTaxable
                        )}</td>
                        <td class="amount">${formatAmount(
                          transaction.taxable
                        )}</td>
                    </tr>
                `;
  });

  // Total
  if (taxableData.total) {
    bodyHtml += `
                    <tr>
                        <td class="aggregate-col" style="text-align: left"><strong>Total</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          taxableData.total.monthlyContribution
                        )}</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          taxableData.total.nonTaxable
                        )}</strong></td>
                        <td class="amount"><strong>${formatAmount(
                          taxableData.total.taxable
                        )}</strong></td>
                    </tr>
                `;
  }

  // Interest updated
  if (taxableData.interestUpdated) {
    bodyHtml += `
                    <tr>
                        <td>${taxableData.interestUpdated.description}</td>
                        <td class="amount">${formatAmount(
                          taxableData.interestUpdated.monthlyContribution
                        )}</td>
                        <td class="amount">${formatAmount(
                          taxableData.interestUpdated.nonTaxable
                        )}</td>
                        <td class="amount">${formatAmount(
                          taxableData.interestUpdated.taxable
                        )}</td>
                    </tr>
                `;
  }

  // Closing balance
  if (taxableData.closingBalance) {
    bodyHtml += `
                    <tr>
                        <td>${taxableData.closingBalance.description}</td>
                        <td class="amount">${formatAmount(
                          taxableData.closingBalance.monthlyContribution
                        )}</td>
                        <td class="amount">${formatAmount(
                          taxableData.closingBalance.nonTaxable
                        )}</td>
                        <td class="amount">${formatAmount(
                          taxableData.closingBalance.taxable
                        )}</td>
                    </tr>
                `;
  }

  document.getElementById("taxableBody").innerHTML = bodyHtml;
}

function formatAmount(amount) {
  if (amount === null || amount === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(amount);
}

window.generatePassbook = function (data) {
  populatePassbook(data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Passbook generated successfully");
    }, 100);
  });
};

const data = {
  memberInfo: {
    establishmentId: "PYKRP2693705000",
    establishmentName: "SALAGENT TECHNOLOGIES PRIVATE LIMITED",
    memberId: "PYKRP26937050000011052",
    memberName: "Rajashanker Kunda",
    dateOfBirth: "1990-11-21",
    uan: "100347718359",
  },
  epfData: {
    financialYear: "2022-23",
    year: 2022,
    openingBalance: {
      description: "As on 01/04/2022",
      employeeBalance: 15200,
      employerBalance: 14800,
      pensionBalance: 12500,
    },
    transactions: [
      {
        month: "April",
        employee: 1800,
        employer: 1800,
        pension: 1500,
      },
      {
        month: "May",
        employee: 1800,
        employer: 1800,
        pension: 1500,
      },
      {
        month: "June",
        employee: 1800,
        employer: 1800,
        pension: 1500,
      },
    ],
    totalContributions: {
      employee: 5400,
      employer: 5400,
      pension: 4500,
    },
    totalTransfers: {
      employee: 2000,
      employer: 1800,
      pension: 0,
    },
    totalWithdrawals: {
      employee: 0,
      employer: 0,
      pension: 0,
    },
    interestUpdated: {
      description: "Interest credited as on 31/03/2023",
      employee: 850,
      employer: 790,
      pension: 620,
    },
    closingBalance: {
      description: "As on 31/03/2023",
      employee: 23450,
      employer: 22990,
      pension: 17620,
    },
  },
  taxableData: {
    financialYear: "2022-23",
    openingBalance: {
      description: "As on 01/04/2022",
      monthlyContribution: 0,
      nonTaxable: 15200,
      taxable: 0,
    },
    transactions: [
      {
        month: "April",
        monthlyContribution: 1800,
        nonTaxable: 1800,
        taxable: 0,
      },
      {
        month: "May",
        monthlyContribution: 1800,
        nonTaxable: 1800,
        taxable: 0,
      },
      {
        month: "June",
        monthlyContribution: 1800,
        nonTaxable: 1800,
        taxable: 0,
      },
    ],
    total: {
      monthlyContribution: 5400,
      nonTaxable: 5400,
      taxable: 0,
    },
    interestUpdated: {
      description: "Interest up to 31/03/2023",
      monthlyContribution: 850,
      nonTaxable: 850,
      taxable: 0,
    },
    closingBalance: {
      description: "As on 31/03/2023",
      monthlyContribution: 11700,
      nonTaxable: 11700,
      taxable: 0,
    },
  },
};

populatePassbook(data);
