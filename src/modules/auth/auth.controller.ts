import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signInUser(email, password);

            if (result === null) {
      // No user found
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (result === false) {
      // Password did not match
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
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

    try{
        const result = await authServices.signUpUser(name, email, password, phone, role)

         res.status(200).json({
            success: false,
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
