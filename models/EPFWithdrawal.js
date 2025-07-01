// models/EPFWithdrawal.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("EPFWithdrawal", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    employee_epf: DataTypes.FLOAT,
    employer_epf: DataTypes.FLOAT,
    employer_eps: DataTypes.FLOAT
  });
};
