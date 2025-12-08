import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signInUser(email, password);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        })
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const signUpUser = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await authServices.signUpUser(name, email, password, phone, role)

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        res.status(200).json({
            success: true,
            message: "user registered successfully",
            data: result
        })
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const authController = {
    signInUser,
    signUpUser
}
