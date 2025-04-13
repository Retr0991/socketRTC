import { Sequelize } from "sequelize-typescript";
import { User } from "./models/Users";
import { config } from "dotenv";
config();

const DB_URL = process.env.DATABASE_URL!;

const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});
sequelize.addModels([User]);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export { sequelize, User };
