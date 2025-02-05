import express from "express";
import cors from "cors";
import sequelize from "./config/database";
// import consoleLog from "./extra/consoleLog";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRouter from "./routes/authRouter";

app.use("/auth", authRouter);

// Define the port
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4444;

// Function to initialize the server
(async () => {
    try {
        // Check database connection
        await sequelize.authenticate();
        console.log("Database connected successfully.");
        // consoleLog("Database connected successfully.");

        // Sync models with the database
        await sequelize.sync();

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
