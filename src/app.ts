import express, { Request, Response } from "express"
import initDB from "./config/db";
import logger from "./middleware/logger";
import { usersRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express()


app.use(express.json());


//initialize db
initDB();

app.get('/api/v1', logger, (req: Request, res: Response) => {
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


export default app;