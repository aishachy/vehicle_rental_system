import { Request, Response } from "express";
import { pool } from "../../config/db"
import { bookingsControllers } from "./bookings.controller";

const createBookings = async (customer_id: number, vehicle_id: number, rent_start_date: Date, rent_end_date: Date, total_price: number, status: string) => {
    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id,
        rent_start_date, rent_end_date,
        total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id,
        rent_start_date, rent_end_date,
        total_price, status])

    return result;
}

const getBookings = async () => {
    const result = await pool.query(`SELECT * FROM bookings`)

    return result
}

const getSingleBookings = async (bookingId: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId])

    return result;
}

const updateBookings = async (rent_start_date: Date, rent_end_date: Date, total_price: number, status: string, bookingId: string) => {
    const result = await pool.query(`UPDATE bookings SET rent_start_date =$1, rent_end_date = $2, total_price = $3, status =$4 WHERE id=$5 RETURNING *`, [rent_start_date, rent_end_date, total_price, status, bookingId])

    return result;
}



export const bookingsServices = {
    createBookings,
    getBookings,
    getSingleBookings,
    updateBookings
}