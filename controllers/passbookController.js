const {
  Member,
  OpeningBalance,
  MonthlyContribution,
  EPFClosingBalance,
  EPFInterestUpdate,
  EPFTotal,
  TotalTransferInsVdrs,
  EPFWithdrawal,
  TaxableOpeningBalance,
  TaxableMonthlyEntry,
  TaxableTotal,
  TaxableInterestUpdate,
  TaxableClosingBalance,
  sequelize,
} = require("../models/index");

// POST: Store Passbook Data
exports.createPassbook = async (req, res) => {
  const {
    member,
    financial_year,
    monthly_contributions,
    total_transfer_ins,
    total_withdrawals,
    interest_update,
    taxable_section,
  } = req.body;

  const t = await sequelize.transaction();
  try {
    await Member.upsert(member, { transaction: t });
    let resolvedOpening;
    const [start] = financial_year.split("-");
    const prevYear = `${parseInt(start) - 1}-${parseInt(start)}`;
    const prevClosing = await EPFClosingBalance.findOne({
      where: { member_id: member.member_id, financial_year: prevYear },
      transaction: t,
    });
    console.log("calculating opening balance for " + financial_year);
    console.log("previous closing balance " + { ...prevClosing });
    resolvedOpening = prevClosing
      ? {
          upto_date: new Date(`${start}-03-31`),
          epf_balance: prevClosing.employee_epf || 0,
          eps_balance: prevClosing.employer_epf || 0,
          pension_balance: prevClosing.employer_eps || 0,
        }
      : {
          upto_date: new Date(`${start}-03-31`),
          epf_balance: 0,
          eps_balance: 0,
          pension_balance: 0,
        };
    await OpeningBalance.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await OpeningBalance.upsert(
      {
        ...resolvedOpening,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await MonthlyContribution.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await MonthlyContribution.bulkCreate(
      monthly_contributions.map((entry) => ({
        ...entry,
        member_id: member.member_id,
        financial_year,
      })),
      { transaction: t }
    );

    await EPFTotal.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    let totals = calculateTotal(monthly_contributions);
    await EPFTotal.upsert(
      {
        ...totals,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await TotalTransferInsVdrs.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await TotalTransferInsVdrs.upsert(
      {
        ...total_transfer_ins,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await EPFWithdrawal.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await EPFWithdrawal.upsert(
      {
        ...total_withdrawals,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await EPFInterestUpdate.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await EPFInterestUpdate.upsert(
      {
        ...interest_update,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await EPFClosingBalance.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    const closing_balance = calculateClosingBalance(
      resolvedOpening,
      totals,
      interest_update,
      total_transfer_ins,
      total_withdrawals
    );

    await EPFClosingBalance.upsert(
      {
        ...closing_balance,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    let resolvedTaxableOpening = null;
    {
      const [start] = financial_year.split("-");
      const prevYear = `${parseInt(start) - 1}-${parseInt(start)}`;
      const prevTaxableClosing = await TaxableClosingBalance.findOne({
        where: { member_id: member.member_id, financial_year: prevYear },
        transaction: t,
      });

      resolvedTaxableOpening = prevTaxableClosing
        ? {
            upto_date: new Date(`${start}-04-01`),
            monthly_contribution: prevTaxableClosing.monthly_contribution,
            cumulative_non_taxable:
              prevTaxableClosing.cumulative_non_taxable || 0,
            cumulative_taxable: prevTaxableClosing.cumulative_taxable || 0,
          }
        : {
            upto_date: new Date(`${start}-04-01`),
            monthly_contribution: 0,
            cumulative_non_taxable: 0,
            cumulative_taxable: 0,
          };
    }
    await TaxableOpeningBalance.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await TaxableOpeningBalance.upsert(
      {
        ...resolvedTaxableOpening,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await TaxableMonthlyEntry.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });

    let cumulativeTaxable = 0;
    let cumulativeNonTaxable = 0;

    const monthlyEntriesWithCumulative = taxable_section.monthly_entries.map(
      (entry) => {
        cumulativeTaxable += entry.cumulative_taxable || 0;
        cumulativeNonTaxable += entry.cumulative_non_taxable || 0;

        return {
          ...entry,
          member_id: member.member_id,
          financial_year,
          cumulative_taxable: cumulativeTaxable,
          cumulative_non_taxable: cumulativeNonTaxable,
        };
      }
    );

    await TaxableMonthlyEntry.bulkCreate(
      monthlyEntriesWithCumulative.map((entry) => ({
        ...entry,
        member_id: member.member_id,
        financial_year,
      })),
      { transaction: t }
    );
    await TaxableTotal.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    const taxable_totals = calculateTaxableTotal(monthlyEntriesWithCumulative);
    await TaxableTotal.upsert(
      {
        member_id: member.member_id,
        ...taxable_totals,
        financial_year,
      },
      { transaction: t }
    );
    await TaxableInterestUpdate.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    await TaxableInterestUpdate.upsert(
      {
        ...taxable_section.interest_update,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );
    await TaxableClosingBalance.destroy({
      where: { member_id: member.member_id, financial_year },
      transaction: t,
    });
    const taxable_closing = calculateClosingBalanceTaxable(
      resolvedTaxableOpening,
      taxable_totals,
      taxable_section.interest_update
    );

    await TaxableClosingBalance.upsert(
      {
        ...taxable_closing,
        member_id: member.member_id,
        financial_year,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Passbook data saved successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error saving passbook data:", error);
    res.status(500).json({ error: "Failed to save passbook data" });
  }
};

exports.getPassbook = async (req, res) => {
  const { member_id, financial_year } = req.params;

  try {
    const member = await Member.findByPk(member_id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const [
      opening_balance,
      monthly_contributions,
      totals,
      total_transfer_ins,
      total_withdrawals,
      interest_update,
      closing_balance,
      taxable_opening,
      taxable_entries,
      taxable_totals,
      taxable_interest,
      taxable_closing,
    ] = await Promise.all([
      OpeningBalance.findOne({ where: { member_id, financial_year } }),
      MonthlyContribution.findAll({ where: { member_id, financial_year } }),
      EPFTotal.findOne({ where: { member_id, financial_year } }),
      TotalTransferInsVdrs.findOne({ where: { member_id, financial_year } }),
      EPFWithdrawal.findOne({ where: { member_id, financial_year } }),
      EPFInterestUpdate.findOne({ where: { member_id, financial_year } }),
      EPFClosingBalance.findOne({ where: { member_id, financial_year } }),
      TaxableOpeningBalance.findOne({ where: { member_id, financial_year } }),
      TaxableMonthlyEntry.findAll({ where: { member_id, financial_year } }),
      TaxableTotal.findOne({ where: { member_id, financial_year } }),
      TaxableInterestUpdate.findOne({ where: { member_id, financial_year } }),
      TaxableClosingBalance.findOne({ where: { member_id, financial_year } }),
    ]);
    console.log([
      member,
      financial_year,
      opening_balance,
      monthly_contributions,
      totals,
      total_transfer_ins,
      total_withdrawals,
      interest_update,
      closing_balance,
      taxable_opening,
      taxable_entries,
      taxable_totals,
      taxable_interest,
      taxable_closing,
    ]);
    const transformed = {
      success: true,
      message: "Passbook data fetched successfully",
      data: {
        memberInfo: {
          establishmentId: member.establishment_id,
          establishmentName: member.establishment_name,
          memberId: member.member_id,
          memberName: member.name,
          dateOfBirth: formatMonthDateToDDMMYYY(member.dob),
          uan: member.uan,
        },
        epfData: {
          financialYear: financial_year,
          year: new Date(financial_year.trim().substring(0, 4)).getFullYear(),
          openingBalance: {
            description: opening_balance?.upto_date
              ? `OB Int. Update upto ${formatToDDMMYYYY(
                  opening_balance.upto_date
                )}`
              : "",
            employeeBalance: opening_balance?.epf_balance || 0,
            employerBalance: opening_balance?.eps_balance || 0,
            pensionBalance: opening_balance?.pension_balance || 0,
          },
          transactions: monthly_contributions.map((c) => ({
            wageMonth: formatMonthYear(c.wage_month),
            date: formatMonthDateToDDMMYYY(c.transaction_date),
            type: c.transaction_type,
            particulars: c.particulars,
            epfWage: c.epf_wages,
            epsWage: c.eps_wages,
            employeeContribution: c.employee_epf,
            employerContribution: c.employer_epf,
            pensionContribution: c.employer_eps,
          })),
          totalContributions: {
            employee: totals?.employee_epf_total || 0,
            employer: totals?.employer_epf_total || 0,
            pension: totals?.employer_eps_total || 0,
          },
          totalTransfers: {
            employee: total_transfer_ins?.employee_epf_total_transfer || 0,
            employer: total_transfer_ins?.employer_epf_total_transfer || 0,
            pension: total_transfer_ins?.employer_eps_total_transfer || 0,
          },
          totalWithdrawals: {
            employee: total_withdrawals?.employee || 0,
            employer: total_withdrawals?.employer || 0,
            pension: total_withdrawals?.pension || 0,
          },
          interestUpdated: {
            description: interest_update?.upto_date
              ? `Int. Updated upto ${formatToDDMMYYYY(
                  interest_update.upto_date
                )}`
              : "",
            employee: interest_update?.employee_epf_interest || 0,
            employer: interest_update?.employer_epf_interest || 0,
            pension: interest_update?.employer_eps_interest || 0,
          },
          closingBalance: {
            description: closing_balance?.upto_date
              ? `Closing Balance as on ${formatToDDMMYYYY(
                  closing_balance.upto_date
                )}`
              : "",
            employee: closing_balance?.employee_epf || 0,
            employer: closing_balance?.employer_epf || 0,
            pension: closing_balance?.employer_eps || 0,
          },
        },
        taxableData: {
          financialYear: financial_year,
          openingBalance: {
            description: taxable_opening?.upto_date
              ? `OB Int. Update upto ${formatToDDMMYYYY(
                  taxable_opening.upto_date
                )}`
              : "",
            monthlyContribution: taxable_opening?.monthly_contribution || 0,
            nonTaxable: taxable_opening?.monthly_contribution || 0,
            taxable: taxable_opening?.cumulative_taxable || 0,
          },
          transactions: taxable_entries.map((entry) => ({
            month: formatMonthYear(entry.month),
            monthlyContribution: entry.monthly_contribution,
            nonTaxable: entry.cumulative_non_taxable,
            taxable: entry.cumulative_taxable,
          })),
          total: {
            monthlyContribution: taxable_totals?.monthly_contribution || 0,
            nonTaxable: taxable_totals?.cumulative_non_taxable || 0,
            taxable: taxable_totals?.cumulative_taxable || 0,
          },
          interestUpdated: {
            description: taxable_interest?.upto_date
              ? `Int. Updated upto ${formatToDDMMYYYY(
                  taxable_interest.upto_date
                )}`
              : "",
            monthlyContribution: taxable_interest?.monthly_contribution || 0,
            nonTaxable: taxable_interest?.cumulative_non_taxable || 0,
            taxable: taxable_interest?.cumulative_taxable || 0,
          },
          closingBalance: {
            description: taxable_closing?.upto_date
              ? `Closing Balance as on ${formatToDDMMYYYY(
                  taxable_closing.upto_date
                )}`
              : "",
            monthlyContribution: taxable_closing?.monthly_contribution || 0,
            nonTaxable: taxable_closing?.cumulative_non_taxable || 0,
            taxable: taxable_closing?.cumulative_taxable || 0,
          },
        },
      },
    };
    res.status(200).json(transformed);
  } catch (error) {
    console.error("Error fetching passbook data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch passbook data",
      error: error.message,
    });
  }
};
const formatMonthYear = (dateString) => {
  console.log("Formatting date string:", dateString);
  const date = new Date(dateString + "-01");
  console.log("Formatted date:", date);
  const options = { month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options).replace(" ", "-");
};
const calculateTotal = (monthly_contributions) => {
  let totalEPF = 0,
    totalEPS = 0,
    totalPension = 0;

  if (Array.isArray(monthly_contributions)) {
    monthly_contributions.forEach((entry) => {
      totalEPF += Number(entry.employee_epf) || 0;
      totalEPS += Number(entry.employer_epf) || 0;
      totalPension += Number(entry.employer_eps) || 0;
    });
  }

  return {
    employee_epf_total: totalEPF,
    employer_epf_total: totalEPS,
    employer_eps_total: totalPension,
  };
};
const calculateClosingBalance = (
  openingBalance,
  totalContributions,
  interestUpdate,
  total_transfer_ins,
  total_withdrawals
) => {
  let closingBalance = {
    employee_epf: openingBalance.epf_balance || 0,
    employer_epf: openingBalance.eps_balance || 0,
    employer_eps: openingBalance.pension_balance || 0,
  };

  closingBalance.employee_epf += totalContributions.employee_epf_total || 0;
  closingBalance.employer_epf += totalContributions.employer_epf_total || 0;
  closingBalance.employer_eps += totalContributions.employer_eps_total || 0;

  closingBalance.employee_epf += interestUpdate.employee_epf_interest || 0;
  closingBalance.employer_epf += interestUpdate.employer_epf_interest || 0;
  closingBalance.employer_eps += interestUpdate.employer_eps_interest || 0;

  closingBalance.employee_epf -=
    total_transfer_ins?.employee_epf_total_transfer || 0;
  closingBalance.employer_epf -=
    total_transfer_ins?.employer_epf_total_transfer || 0;
  closingBalance.employer_eps -=
    total_transfer_ins?.employer_eps_total_transfer || 0;
  closingBalance.employee_epf -= total_withdrawals?.employee_epf || 0;
  closingBalance.employer_epf -= total_withdrawals?.employer_epf || 0;
  closingBalance.employer_eps -= total_withdrawals?.employer_eps || 0;
  closingBalance.upto_date =
    interestUpdate.upto_date || openingBalance.upto_date;
  if (closingBalance.upto_date) {
    closingBalance.upto_date = new Date(closingBalance.upto_date)
      .toISOString()
      .split("T")[0];
  }
  return closingBalance;
};
const calculateTaxableTotal = (monthly_entries) => {
  let totalMonthlyContribution = 0,
    totalTaxable = 0;

  if (Array.isArray(monthly_entries)) {
    monthly_entries.forEach((entry) => {
      totalMonthlyContribution += Number(entry.monthly_contribution) || 0;
      totalTaxable += Number(entry.cumulative_taxable) || 0;
    });
  }

  return {
    monthly_contribution: totalMonthlyContribution,
    cumulative_non_taxable: totalMonthlyContribution - totalTaxable,
    cumulative_taxable: totalTaxable,
  };
};
const calculateClosingBalanceTaxable = (
  openingBalance,
  totalContributions,
  interestUpdate
) => {
  let closingBalance = {
    monthly_contribution: openingBalance.monthly_contribution || 0,
    cumulative_non_taxable: openingBalance.cumulative_non_taxable || 0,
    cumulative_taxable: openingBalance.cumulative_taxable || 0,
  };

  closingBalance.monthly_contribution +=
    totalContributions.monthly_contribution || 0;
  closingBalance.cumulative_non_taxable +=
    totalContributions.cumulative_non_taxable || 0;
  closingBalance.cumulative_taxable +=
    totalContributions.cumulative_taxable || 0;

  closingBalance.monthly_contribution +=
    interestUpdate.monthly_contribution || 0;
  closingBalance.cumulative_non_taxable +=
    interestUpdate.cumulative_non_taxable || 0;
  closingBalance.cumulative_taxable += interestUpdate.cumulative_taxable || 0;

  closingBalance.upto_date =
    interestUpdate.upto_date || openingBalance.upto_date;
  if (closingBalance.upto_date) {
    closingBalance.upto_date = new Date(closingBalance.upto_date)
      .toISOString()
      .split("T")[0];
  }
  return closingBalance;
};
const formatToDDMMYYYY = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};
const formatMonthDateToDDMMYYY = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};
