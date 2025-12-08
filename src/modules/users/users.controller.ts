import { Request, Response } from "express";
import { usersServices } from "./users.service";
import { pool } from "../../config/db";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await usersServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "data inserted successfully",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getUsers = async (req: Request, res: Response) => {

  try {
    const result = await usersServices.getUsers();

    const users = result.rows.map(({ password, ...safeUser }) => safeUser);

    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: users
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getSingleUsers = async (req: Request, res: Response) => {

  try {

    const result = await usersServices.getSingleUsers(req.params.userId!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found"
      })
    } else {
      res.status(200).json({
        success: true,
        message: "user fetched",
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

const updateUsers = async (req: Request, res: Response) => {

  const { name, email, password, phone, role } = req.body;

  try {

    const targetUserId = req.params.userId;
    const currentUser = req.user;
    const updates = { ...req.body };

    if (currentUser?.role === "admin") {
      const result = await usersServices.updateUsers(updates.name, updates.email, updates.password, updates.phone, updates.role || "", targetUserId as string)

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }

    if (currentUser?.id === targetUserId) {
      delete updates.role;

      const result = await usersServices.updateUsers(updates.name, updates.email, updates.password, updates.phone, "", targetUserId as string)

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: result.rows[0],
      });
    }

    return res.status(403).json({ success: false, message: "Forbidden: Cannot update other users." });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUsers = async (req: Request, res: Response) => {

  const userId = req.params.userId;
  const currentUser = req.user;

  try {

    if (currentUser?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admins only can delete",
      });
    }

    const activeBookings = await pool.query(`SELECT * FROM bookings WHERE id=$1 AND status = 'active'`, [userId])

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "cannot delete user. Active bookings exist"
      })
    }

    const result = await usersServices.deleteUsers(req.params.userId!)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "user not found"
      })
    } else {
      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      })
    }

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const usersControllers = {
  createUser,
  getUsers,
  getSingleUsers,
  updateUsers,
  deleteUsers
}