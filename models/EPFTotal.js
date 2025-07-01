// models/EPFTotal.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("EPFTotal", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    employee_epf_total: DataTypes.FLOAT,
    employer_epf_total: DataTypes.FLOAT,
    employer_eps_total: DataTypes.FLOAT
  });
};
