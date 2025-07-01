// models/EPFInterestUpdate.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("EPFInterestUpdate", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    upto_date: DataTypes.DATEONLY,
    employee_epf_interest: DataTypes.FLOAT,
    employer_epf_interest: DataTypes.FLOAT,
    employer_eps_interest: DataTypes.FLOAT
  });
};
