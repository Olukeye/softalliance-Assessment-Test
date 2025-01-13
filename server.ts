// import "express-async-errors";
import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./src/config/database";


dotenv.config({ path: "./.env" });

connectDB();

const start = async () => {
 connectDB();

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Listening on port:${PORT}`);
  });
};

start();
