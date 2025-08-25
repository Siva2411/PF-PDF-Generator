// const sequelize = require("../config/database");
// const { DataTypes } = require("sequelize");

const { sequelize, DataTypes } = require("../config/database copy.js");
const Member = require("./Member")(sequelize, DataTypes);
const OpeningBalance = require("./OpeningBalance")(sequelize, DataTypes);
const MonthlyContribution = require("./MonthlyContribution")(
  sequelize,
  DataTypes
);
const EPFClosingBalance = require("./EPFClosingBalance")(sequelize, DataTypes);
const EPFInterestUpdate = require("./EPFInterestUpdate")(sequelize, DataTypes);
const EPFTotal = require("./EPFTotal")(sequelize, DataTypes);
const TotalTransferInsVdrs = require("./TotalTransferInsVdrs")(
  sequelize,
  DataTypes
);
const EPFWithdrawal = require("./EPFWithdrawal")(sequelize, DataTypes);
const TaxableOpeningBalance = require("./TaxableOpeningBalance")(
  sequelize,
  DataTypes
);
const TaxableMonthlyEntry = require("./TaxableMonthlyEntry")(
  sequelize,
  DataTypes
);
const TaxableInterestUpdate = require("./TaxableInterestUpdate")(
  sequelize,
  DataTypes
);
const TaxableClosingBalance = require("./TaxableClosingBalance")(
  sequelize,
  DataTypes
);
const TaxableTotal = require("./TaxableTotal")(sequelize, DataTypes);

// Sync all models
sequelize.sync();

module.exports = {
  sequelize,
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
  TaxableInterestUpdate,
  TaxableClosingBalance,
  TaxableTotal,
};
