import { Request, Response } from "express";
import { pool } from "../../config/db";
import { bookingsServices } from "./bookings.service";

const createBookings = async (req: Request, res: Response) => {

    const { customer_id, vehicle_id,
        rent_start_date, rent_end_date } = req.body;

    try {

        const startDate = new Date(rent_start_date);
        const endDate = new Date(rent_end_date)

        if (endDate <= startDate) {
            return res.status(400).json({
                success: false,
                message: "End date must be after starting date"
            });
        }

        const vehicleAvailability = await pool.query(`SELECT id, vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`, [vehicle_id]);

        if (vehicleAvailability.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "vehicle not found"
            })
        }

        const vehicle = vehicleAvailability.rows[0]

        if (vehicle.availability_status !== 'available') {
            res.status(400).json({
                success: false,
                message: "Vehicle is already booked"
            })
        }

        const number_of_days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        const total_price = vehicle.daily_rent_price * number_of_days
        const status = "active"

        const result = await bookingsServices.createBookings(customer_id, vehicle_id,
            rent_start_date, rent_end_date, total_price, status)

        const booking = result.rows[0]

        await pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id=$1`, [vehicle_id])

        booking.vehicle = {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getBookings = async (req: Request, res: Response) => {

    try {
        const result = await bookingsServices.getBookings()

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result.rows
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getSingleBookings = async (req: Request, res: Response) => {

    try {

        const bookingId = req.params.bookingId;
        const result = await bookingsServices.getSingleBookings(bookingId!)

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "booking not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Bookings retreived successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateBookings = async (req: Request, res: Response) => {

    const { rent_start_date, rent_end_date, total_price, status } = req.body;
    const bookingId = req.params.bookingId;
    const currentUser = req.user;

    try {

        const bookingFetching = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId])
        if (bookingFetching.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }
        const booking = bookingFetching.rows[0]

        if (currentUser?.role === "customer") {
            if (booking.customer_id !== currentUser.id) {
                return res.status(403).json({
                    success: false,
                    message: "forbidden access"
                })
            }

            const today = new Date();
            const startDate = new Date(booking.rent_start_date);

            if (today >= startDate) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot change after first date"
                })
            }

            const result = await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id=$1 RETURNING *`, [bookingId])
            return res.status(200).json({
                success: true,
                message: "cancelled",
                data: result.rows[0]
            })
        }

        if (currentUser?.role === 'admin') {
            const result = await pool.query(`UPDATE bookings SET status = 'returned' WHERE id =$1 RETURNING *`, [bookingId])

            const available = await pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [booking.vehicle_id])
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result.rows[0]
            })
        }

        if (currentUser?.role === "system") {
            const today = new Date();
            const endDate = new Date(booking.rent_end_date)

            if (today >= endDate && booking.status !== "returned") {
                const result = await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`, [bookingId])
                const status = await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id = $1`, [booking.vehicle_id]);
            }
        }
        return res.status(403).json({ 
            success: false,
            message: "Forbidden: Cannot update booking" });
    } catch (err: any) {
        return res.status(500).json({ 
            success: false, 
            message: err.message });
    }
}


export const bookingsControllers = {
    createBookings,
    getBookings,
    getSingleBookings,
    updateBookings
}