import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// /api/users/register
router.post(
    "/register",
    [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Larst Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 0r more characters required ").isLength({
        min:6
    }),
    check("phone","phone number is required").isLength({min:10}),

] ,
async( req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()});
    }
    try{
        let user = await User.findOne({
            email: req.body.email,
        });

        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User(req.body);
        await user.save();

        const token = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET_KEY as string, 
        {
            expiresIn: "1d"
        }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        return res.status(200).send({message: "User registered OK"});
    } catch(error){
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
 });
//

// // Route to fetch all users
// router.get('/all', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Route to search users by phone number 
// router.get('/search/phone/:phone', async (req, res) => {
//   const { phone } = req.params;
//   try {
   
//     const user = await User.findOne({ phone });
//     if (!user) {
//       console.log('User not found with phone number:', phone);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error('Error searching users by phone number:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



 export default router;




 