// models/MonthlyContribution.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("MonthlyContribution", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    wage_month: DataTypes.STRING,
    transaction_date: DataTypes.DATEONLY,
    transaction_type: DataTypes.STRING,
    particulars: DataTypes.STRING,
    epf_wages: DataTypes.FLOAT,
    eps_wages: DataTypes.FLOAT,
    employee_epf: DataTypes.FLOAT,
    employer_epf: DataTypes.FLOAT,
    employer_eps: DataTypes.FLOAT
  });
};
