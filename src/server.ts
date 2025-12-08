import express, { Request, Response } from "express"
import config from "./config";
import cors from 'cors';
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { usersRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express()
const port = config.port;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5000', // your frontend URL
  credentials: true,               // allow cookies
}));

//initialize db
initDB();

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello NextLevel Web Developers')
});

//users 

app.use("/api/v1/users", usersRoutes)

// vehicles

app.use("/api/v1/vehicles", vehiclesRoutes)

//bookings

app.use("/api/v1/bookings", bookingsRoutes)

//auth

app.use("/api/v1/auth", authRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
