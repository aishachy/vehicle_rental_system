import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";
import { pool } from "../../config/db";

const createVehicles = async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await vehiclesServices.createVehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getVehicles = async (req: Request, res: Response) => {

  try {
    const result = await vehiclesServices.getVehicles()

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "No vehicles found",
      data: []
    })
  }
}

const getSingleVehicles = async (req: Request, res: Response) => {
   
     try {
       const result = await vehiclesServices.getSingleVehicles(req.params.vehicleId!)
   
       if (result.rows.length === 0) {
         res.status(404).json({
           success: false,
           message: "vehicle not found"
         })
       } else {
         res.status(200).json({
           success: true,
           message: "Vehicle retrieved successfully",
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

const updateVehicles = async (req: Request, res: Response) => {
 
   const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
 
   try {
     const result = await vehiclesServices.updateVehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId!)
 
     if (result.rows.length === 0) {
       res.status(404).json({
         success: false,
         message: "vehicle not found"
       })
     } else {
       res.status(200).json({
         success: true,
         message: "Vehicle updated successfully",
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

const deleteVehicles = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {

    const bookingCheck = await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [vehicleId])

    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Active bookings still exist. Cannot delete"
      })
    }

    const result = await vehiclesServices.deleteVehicles(vehicleId!)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "vehicle not found"
      })
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully"
      })
    }

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const vehiclesControllers = {
    createVehicles,
    getVehicles,
    getSingleVehicles,
    updateVehicles,
    deleteVehicles
}