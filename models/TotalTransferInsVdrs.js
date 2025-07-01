// models/TotalTransferInsVdrs.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TotalTransferInsVdrs", {
    member_id: {
      type: DataTypes.STRING,
      references: { model: "Members", key: "member_id" }
    },
    financial_year: DataTypes.STRING,

    employee_epf_total_transfer: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    employer_epf_total_transfer: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    employer_eps_total_transfer: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  });
};
