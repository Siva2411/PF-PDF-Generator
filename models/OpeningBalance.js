// models/OpeningBalance.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("OpeningBalance", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    upto_date: DataTypes.DATEONLY,
    epf_balance: DataTypes.FLOAT,
    eps_balance: DataTypes.FLOAT,
    pension_balance: DataTypes.FLOAT
  });
};
