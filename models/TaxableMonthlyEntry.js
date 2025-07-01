// models/TaxableMonthlyEntry.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TaxableMonthlyEntry", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    month: DataTypes.STRING,
    monthly_contribution: DataTypes.FLOAT,
    cumulative_non_taxable: DataTypes.FLOAT,
    cumulative_taxable: DataTypes.FLOAT
  });
};
