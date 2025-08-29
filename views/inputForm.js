const financialYearSelect = document.getElementById("financial_year");
for (let year = 2000; year <= 2099; year++) {
  const option = document.createElement("option");
  option.value = `${year}-${year + 1}`;
  option.textContent = `${year}-${year + 1}`;
  financialYearSelect.appendChild(option);
}

let monthlyContributionIndex = 1;
let taxableMonthlyEntryIndex = 1;

function getCustomFinancialYearMonthRange(financialYear) {
  const [startYearStr, endYearStr] = financialYear.trim().split("-");
  const startYear = parseInt(startYearStr, 10);
  const endYear = parseInt(endYearStr, 10);

  // March of startYear to February of endYear
  const minMonth = `${startYear}-03`;
  const maxMonth = `${endYear}-03`;

  return { minMonth, maxMonth };
}
// Update min and max attributes for existing wage_month inputs
function updateWageMonthLimitsCustom() {
  const financialYear = document.getElementById("financial_year").value;
  if (!financialYear) return;

  const [startYearStr, endYearStr] = financialYear.split("-");
  const startYear = parseInt(startYearStr);
  const endYear = parseInt(endYearStr);

  // Wage month range: Mar (start year) to Feb (end year)
  const minMonth = `${startYear}-03`;
  const maxMonth = `${endYear}-03`;

  // Transaction date range: 01-Mar-startYear to 28-Feb-endYear
  const minDate = `${startYear}-03-01`;
  const maxDate = `${endYear}-03-31`;

  // Update wage month fields
  const wageMonthInputs = document.querySelectorAll(
    '#monthly_contributions input[type="month"]'
  );
  wageMonthInputs.forEach((input) => {
    input.min = minMonth;
    input.max = maxMonth;
    if (input.value && (input.value < minMonth || input.value > maxMonth)) {
      input.value = "";
    }
  });

  // Update transaction date fields
  const dateInputs = document.querySelectorAll(
    '#monthly_contributions input[type="date"]'
  );
  dateInputs.forEach((input) => {
    input.min = minDate;
    input.max = maxDate;
    if (input.value && (input.value < minDate || input.value > maxDate)) {
      input.value = "";
    }
  });
}
// function updateTaxableMonthLimits() {
//   const financialYear = document.getElementById("financial_year").value;
//   if (!financialYear) return;

//   const [startYearStr, endYearStr] = financialYear.split("-");
//   const startYear = parseInt(startYearStr);
//   const endYear = parseInt(endYearStr);

//   // Min = April of startYear
//   const minMonth = `${startYear}-04`;

//   // Max = March of endYear
//   const maxMonth = `${endYear}-03`;

//   const taxableMonthInputs = document.querySelectorAll(
//     '#taxable_section_monthly_entries input[type="month"]'
//   );

//   taxableMonthInputs.forEach((input) => {
//     input.min = minMonth;
//     input.max = maxMonth;
//     if (input.value) {
//       if (input.value < minMonth || input.value > maxMonth) {
//         input.value = "";
//       }
//     }
//   });
// }

financialYearSelect.addEventListener("change", () => {
  updateWageMonthLimitsCustom();
  // updateTaxableMonthLimits();
  updateDateLimits();
  console.log("Financial Year changed, limits updated.");
});

function addMonthlyContributionRow() {
  console.log("Adding Monthly Contribution Row");
  const container = document.getElementById("monthly_contributions");
  const newEntry = document.createElement("div");
  newEntry.className = "array-entry";
  newEntry.dataset.index = monthlyContributionIndex;
  newEntry.innerHTML = `
        <div class="grid-container">
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_wage_month">Wage Month:</label>
            <input type="month" id="monthly_contributions_${monthlyContributionIndex}_wage_month" name="monthly_contributions_${monthlyContributionIndex}_wage_month" required >
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_transaction_date">Transaction Date:</label>
            <input type="date" id="monthly_contributions_${monthlyContributionIndex}_transaction_date" name="monthly_contributions_${monthlyContributionIndex}_transaction_date" required>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_transaction_type">Transaction Type:</label>
            <select type="text" id="monthly_contributions_${monthlyContributionIndex}_transaction_type" name="monthly_contributions_${monthlyContributionIndex}_transaction_type" required>
              <option value="">Select</option>
              <option value="DR">Dr</option>
              <option value="CR">Cr</option>
            </select>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_particulars">Particulars:</label>
            <input type="text" id="monthly_contributions_${monthlyContributionIndex}_particulars" name="monthly_contributions_${monthlyContributionIndex}_particulars" required>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_epf_wages">EPF Wages (₹):</label>
            <input type="number" id="monthly_contributions_${monthlyContributionIndex}_epf_wages" name="monthly_contributions_${monthlyContributionIndex}_epf_wages" min="0" step="1" required onchange=updateEPFValues(${monthlyContributionIndex})>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_eps_wages">EPS Wages (₹):</label>
            <input type="number" id="monthly_contributions_${monthlyContributionIndex}_eps_wages" name="monthly_contributions_${monthlyContributionIndex}_eps_wages" min="0" step="1" required>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_employee_epf">Employee EPF (₹):</label>
            <input type="number" id="monthly_contributions_${monthlyContributionIndex}_employee_epf" name="monthly_contributions_${monthlyContributionIndex}_employee_epf" min="0" step="1" required>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_employer_epf">Employer EPF (₹):</label>
            <input type="number" id="monthly_contributions_${monthlyContributionIndex}_employer_epf" name="monthly_contributions_${monthlyContributionIndex}_employer_epf" min="0" step="1" required>
          </div>
          <div class="form-group">
            <label for="monthly_contributions_${monthlyContributionIndex}_employer_eps">Employer EPS (₹):</label>
            <input type="number" id="monthly_contributions_${monthlyContributionIndex}_employer_eps" name="monthly_contributions_${monthlyContributionIndex}_employer_eps" min="0" step="1" required>
          </div>
        </div>
      `;
  container.appendChild(newEntry);
  autoFillParticulars(monthlyContributionIndex);
  monthlyContributionIndex++;
}
function removeRow(button) {
  const row = button.parentNode;
  row.parentNode.removeChild(row);
}

function autoFillParticulars(index) {
  const wageMonthInput = document.getElementById(
    `monthly_contributions_${index}_wage_month`
  );
  const transactionTypeInput = document.getElementById(
    `monthly_contributions_${index}_transaction_type`
  );
  const particularsInput = document.getElementById(
    `monthly_contributions_${index}_particulars`
  );

  function updateParticulars() {
    const wageMonth = wageMonthInput.value; // format: "YYYY-MM"

    if (wageMonth) {
      let [year, month] = wageMonth.split("-").map(Number);

      // Increment month for due month
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
      if (month < 10) {
        month = `0${month}`; // Ensure month is two digits
      } else {
        month = `${month}`;
      }
      particularsInput.value = `Cont. For Due-Month ${month}${year}`;
    }
  }

  wageMonthInput.addEventListener("change", updateParticulars);
}

function deleteMonthlyContributionRow() {
  const container = document.getElementById("monthly_contributions");
  const entries = container.getElementsByClassName("array-entry");
  if (entries.length > 1) {
    container.removeChild(entries[entries.length - 1]);
    monthlyContributionIndex--;
  } else {
    alert("At least one entry is required.");
  }
}

// function addTaxableMonthlyEntryRow() {
//   const container = document.getElementById("taxable_section_monthly_entries");
//   const newEntry = document.createElement("div");
//   newEntry.className = "array-entry";
//   newEntry.dataset.index = taxableMonthlyEntryIndex;
//   newEntry.innerHTML = `
//         <div class="grid-container">
//           <div class="form-group">
//             <label for="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_month">Month:</label>
//             <input type="month" id="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_month" name="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_month" required>
//           </div>
//           <div class="form-group">
//             <label for="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_monthly_contribution">Monthly Contribution (₹):</label>
//             <input type="number" id="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_monthly_contribution" name="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_monthly_contribution" min="0" step="1" required>
//           </div>
//           <div class="form-group">
//             <label for="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_cumulative_non_taxable">Non-Taxable (₹):</label>
//             <input type="number" id="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_cumulative_non_taxable" name="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_cumulative_non_taxable" min="0" step="1" required>
//           </div>
//           <div class="form-group">
//             <label for="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_cumulative_taxable">Taxable (₹):</label>
//             <input type="number" id="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_cumulative_taxable" name="taxable_section_monthly_entries_${taxableMonthlyEntryIndex}_cumulative_taxable" min="0" step="1" required>
//           </div>
//         </div>
//       `;
//   container.appendChild(newEntry);
//   taxableMonthlyEntryIndex++;
// }

// function deleteTaxableMonthlyEntryRow() {
//   const container = document.getElementById("taxable_section_monthly_entries");
//   const entries = container.getElementsByClassName("array-entry");
//   if (entries.length > 1) {
//     container.removeChild(entries[entries.length - 1]);
//     taxableMonthlyEntryIndex--;
//   } else {
//     alert("At least one entry is required.");
//   }
// }

async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("epfForm"));
  const data = {
    member: {
      member_id: formData.get("member_member_id"),
      uan: formData.get("member_uan"),
      name: formData.get("member_name"),
      dob: formData.get("member_dob"),
      establishment_id: formData.get("member_establishment_id"),
      establishment_name: formData.get("member_establishment_name"),
    },
    financial_year: formData.get("financial_year"),
    // opening_balance: {
    //   upto_date: formData.get("opening_balance_upto_date"),
    //   epf_balance: parseInt(formData.get("opening_balance_epf_balance")),
    //   eps_balance: parseInt(formData.get("opening_balance_eps_balance")),
    //   pension_balance: parseInt(
    //     formData.get("opening_balance_pension_balance")
    //   ),
    // },
    monthly_contributions: [],
    total_withdrawals: {
      employee_epf: parseInt(formData.get("total_withdrawals_employee_epf")),
      employer_epf: parseInt(formData.get("total_withdrawals_employer_epf")),
      employer_eps: parseInt(formData.get("total_withdrawals_employer_eps")),
    },
    total_transfer_ins: {
      employee_epf: parseInt(formData.get("total_transfer_ins_employee_epf")),
      employer_epf: parseInt(formData.get("total_transfer_ins_employer_epf")),
      employer_eps: parseInt(formData.get("total_transfer_ins_employer_eps")),
    },
    interest_update: {
      upto_date: formData.get("interest_update_upto_date"),
      employee_epf_interest: parseInt(
        formData.get("interest_update_employee_epf_interest")
      ),
      employer_epf_interest: parseInt(
        formData.get("interest_update_employer_epf_interest")
      ),
      employer_eps_interest: parseInt(
        formData.get("interest_update_employer_eps_interest")
      ),
    },
    taxable_section: {
      // opening_balance: {
      //   upto_date: formData.get("taxable_section_opening_balance_upto_date"),
      //   monthly_contribution: parseInt(
      //     formData.get("taxable_section_opening_balance_monthly_contribution")
      //   ),
      //   cumulative_non_taxable: parseInt(
      //     formData.get("taxable_section_opening_balance_cumulative_non_taxable")
      //   ),
      //   cumulative_taxable: parseInt(
      //     formData.get("taxable_section_opening_balance_cumulative_taxable")
      //   ),
      // },
      // monthly_entries: [],
      // interest_update: {
      //   upto_date: formData.get("taxable_section_interest_update_upto_date"),
      //   monthly_contribution: parseInt(
      //     formData.get("taxable_section_interest_update_monthly_contribution")
      //   ),
      //   cumulative_non_taxable: parseInt(
      //     formData.get("taxable_section_interest_update_cumulative_non_taxable")
      //   ),
      //   cumulative_taxable: parseInt(
      //     formData.get("taxable_section_interest_update_cumulative_taxable")
      //   ),
      // },
      monthly_entries: [],
      interest_update: {
        upto_date: null,
        monthly_contribution: 0,
        cumulative_non_taxable: 0,
        cumulative_taxable: 0,
      },
    },
  };
  const contributionEntries = document.querySelectorAll(
    "#monthly_contributions .array-entry"
  );
  contributionEntries.forEach((entry, index) => {
    const contribution = {
      wage_month: formData.get(`monthly_contributions_${index}_wage_month`),
      transaction_date: formData.get(
        `monthly_contributions_${index}_transaction_date`
      ),
      transaction_type: formData.get(
        `monthly_contributions_${index}_transaction_type`
      ),
      particulars: formData.get(`monthly_contributions_${index}_particulars`),
      epf_wages: parseInt(
        formData.get(`monthly_contributions_${index}_epf_wages`)
      ),
      eps_wages: parseInt(
        formData.get(`monthly_contributions_${index}_eps_wages`)
      ),
      employee_epf: parseInt(
        formData.get(`monthly_contributions_${index}_employee_epf`)
      ),
      employer_epf: parseInt(
        formData.get(`monthly_contributions_${index}_employer_epf`)
      ),
      employer_eps: parseInt(
        formData.get(`monthly_contributions_${index}_employer_eps`)
      ),
    };
    data.monthly_contributions.push(contribution);
  });

  // Collect taxable section monthly entries
  // const taxableEntries = document.querySelectorAll(
  //   "#taxable_section_monthly_entries .array-entry"
  // );
  // taxableEntries.forEach((entry, index) => {
  //   const taxableEntry = {
  //     month: formData.get(`taxable_section_monthly_entries_${index}_month`),
  //     monthly_contribution: parseInt(
  //       formData.get(
  //         `taxable_section_monthly_entries_${index}_monthly_contribution`
  //       )
  //     ),
  //     cumulative_non_taxable: parseInt(
  //       formData.get(
  //         `taxable_section_monthly_entries_${index}_cumulative_non_taxable`
  //       )
  //     ),
  //     cumulative_taxable: parseInt(
  //       formData.get(
  //         `taxable_section_monthly_entries_${index}_cumulative_taxable`
  //       )
  //     ),
  //   };
  //   data.taxable_section.monthly_entries.push(taxableEntry);
  // });
  let taxableEntries = initTaxableEntries(data.financial_year);
  data.monthly_contributions.forEach((monthly_contribution) => {
    const transactionMonth = monthly_contribution.transaction_date
      ? monthly_contribution.transaction_date.slice(0, 7)
      : null;
    if (!transactionMonth) return; // skip if no date

    const taxableEntry = taxableEntries.find(
      (te) => te.month === transactionMonth
    );
    if (taxableEntry) {
      taxableEntry.monthly_contribution = monthly_contribution.employee_epf;
      taxableEntry.non_taxable = monthly_contribution.employee_epf;
      taxableEntry.taxable = 0;
    }
  });
  data.taxable_section.monthly_entries = taxableEntries;
  data.taxable_section.interest_update.upto_date =
    data.interest_update.upto_date;
  data.taxable_section.interest_update.monthly_contribution =
    data.interest_update.employee_epf_interest;
  data.taxable_section.interest_update.cumulative_non_taxable =
    data.interest_update.employee_epf_interest;
  data.taxable_section.interest_update.cumulative_taxable = 0;
  console.log("Form Data:", JSON.stringify(data, null, 2));

  try {
    const response = await fetch("/api/passbook/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      window.location.href = "/pfGenerateForm.html";
    } else {
      alert("Failed to submit form. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred. Please check the console for details.");
  }
}

function initTaxableEntries(financialYear) {
  const [startYearStr, endYearStr] = financialYear.split("-");
  const startYear = parseInt(startYearStr);
  const endYear = parseInt(endYearStr);

  taxableEntries = [];

  // April to December
  for (let month = 4; month <= 12; month++) {
    taxableEntries.push({
      month: `${startYear}-${month.toString().padStart(2, "0")}`,
      monthly_contribution: 0,
      taxable: 0,
      non_taxable: 0,
    });
  }

  // January to March
  for (let month = 1; month <= 3; month++) {
    taxableEntries.push({
      month: `${endYear}-${month.toString().padStart(2, "0")}`,
      monthly_contribution: 0,
      taxable: 0,
      non_taxable: 0,
    });
  }
  return taxableEntries;
}

const updateDateLimits = () => {
  const financialYear = financialYearSelect.value;
  const [startYearStr, endYearStr] = financialYear.split("-");
  const startYear = parseInt(startYearStr);
  const endYear = parseInt(endYearStr);

  const minDate = `${startYear}-01-01`;
  const maxDate = `${endYear}-12-31`;

  const dateFields = [
    "opening_balance_upto_date",
    "interest_update_upto_date",
    "taxable_section_opening_balance_upto_date",
    "taxable_section_interest_update_upto_date",
  ];

  dateFields.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.min = minDate;
      input.max = maxDate;
    }
  });
};
window.addEventListener("DOMContentLoaded", () => {
  autoFillParticulars(0);
});
function updateEPFValues(index) {
  const epfWages =
    parseFloat(
      document.getElementById(`monthly_contributions_${index}_epf_wages`).value
    ) || 0;

  const employeeEPF = Math.round(epfWages * 0.12); // 12%
  const employerEPS = Math.round(epfWages * 0.083333); // 8.33%
  const employerEPF = employeeEPF - employerEPS; // 3.67%
  document.getElementById(`monthly_contributions_${index}_eps_wages`).value =
    epfWages;
  document.getElementById(`monthly_contributions_${index}_employee_epf`).value =
    employeeEPF;
  document.getElementById(`monthly_contributions_${index}_employer_epf`).value =
    employerEPF;
  document.getElementById(`monthly_contributions_${index}_employer_eps`).value =
    employerEPS;
}
