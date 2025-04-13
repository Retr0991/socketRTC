"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./models/Users");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return Users_1.User; } });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const DB_URL = process.env.DATABASE_URL;
const sequelize = new sequelize_typescript_1.Sequelize(DB_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});
exports.sequelize = sequelize;
sequelize.addModels([Users_1.User]);
sequelize
    .authenticate()
    .then(() => {
    console.log("Connected to DB.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
