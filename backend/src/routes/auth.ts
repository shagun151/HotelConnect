import express, {Request, Response} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import { verify } from "crypto";
import verifyToken from "../middleware/auth"

const router = express.Router();



router.post("/login",[
    check("password","Password with 6 or more characters required").isLength({
        min: 6,
    }),
], async (req: Request,res: Response)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ messages: errors.array()})
    }
    const {emailOrPhone,password}= req.body;

    try{
        
        console.log("Received email:", emailOrPhone);
        console.log("Received password:", password);
        const user = await User.findOne({$or: [{ email: emailOrPhone }, { phone: emailOrPhone }],});
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string,{
            expiresIn:"1d",
        }
            );

            res.cookie("auth_token", token, {
                httpOnly:true,
                secure: process.env.NODE_ENV ==="production",
                maxAge:86400000,
            });
            res.status(200).json({userId: user._id})
    }
        catch(error){
            console.log(error);
            res.status(500).json({message: "Something"})
        }
    }
);

router.get("/validate-token", verifyToken, async (req: Request, res:Response)=>{
    //res.status(200).send({userId: req.userId})
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
    
        if (!user) {
          // If user is not found
          return res.status(404).json({ message: "User not found" });
        }
        // Send the user details along with the status
        res.status(200).json({
          status: "success",
          user: {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone:user.phone,
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }

});

router.post("/logout", (req:Request, res:Response)=>{
    res.cookie("auth_token", "",{
        expires:new Date(0),
    });
    res.send();
});

export default router;