// models/Member.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Member", {
    member_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    uan: DataTypes.STRING,
    name: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    establishment_id: DataTypes.STRING,
    establishment_name: DataTypes.STRING
  });
};
