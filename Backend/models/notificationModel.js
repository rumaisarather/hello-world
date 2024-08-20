const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    "notification",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      notifications: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      send_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "notifications", // Optional: Specify the table name explicitly
      timestamps: true, // Adds `createdAt` and `updatedAt` fields
    }
  );

  return Notification;
};
