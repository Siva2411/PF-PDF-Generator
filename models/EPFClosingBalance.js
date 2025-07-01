module.exports = (sequelize, DataTypes) => {
  return sequelize.define("EPFClosingBalance", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,
    upto_date: DataTypes.DATEONLY,
    employee_epf: DataTypes.FLOAT,
    employer_epf: DataTypes.FLOAT,
    employer_eps: DataTypes.FLOAT
  });
};
