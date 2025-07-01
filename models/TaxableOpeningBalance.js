module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TaxableOpeningBalance", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" },
    },
    financial_year: DataTypes.STRING,
    upto_date: DataTypes.DATEONLY,
    monthly_contribution: DataTypes.FLOAT,
    cumulative_non_taxable: DataTypes.FLOAT,
    cumulative_taxable: DataTypes.FLOAT,
  });
};
