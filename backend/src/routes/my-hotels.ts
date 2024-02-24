import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import {HotelType} from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
//import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024 //5MB
    }
})

//api/my-hotels
router.post(
    "/",
    verifyToken,[
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel type is required'),
        body("pricePerNight")
        .notEmpty()
        .isNumeric()
        .withMessage('Price per Night is required and must be a number'),
        body("facilities")
        .notEmpty()
        .isArray() 
        .withMessage('Facilities are required'),
    ],
    upload.array("imageFiles", 6),
    async(req: Request, res:Response)=>{
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newhotel: HotelType = req.body;
        //1. upload the image to cloudinary

    const uploadPromises = imageFiles.map(async(image)=>{
        const b64 = Buffer.from(image.buffer).toString("base64")
        let dataURI="data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    newhotel.imageUrls = imageUrls;
    newhotel.lastUpdated = new Date();
    newhotel.userId = req.userId;

    //save new hotel in database
    const hotel = new Hotel(newhotel);
    await hotel.save();

    // return 201 status 
    res.status(201).send(hotel);
    } catch (e) {
       console.log ("Error creating hotel;",e);
       res.status(500).json({message:"Something went wrong"});
    }

}
);

router.get("/", verifyToken ,async(req:Request,res:Response)=>{
    try{
        const hotels = await Hotel.find({userId: req.userId});
    res.json(hotels);
    }
    catch(error){
            res.status(500).json({message:"Error fetching hotels"})
        
    }
});

export default router;

/*import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../models/hotel";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// api/my-hotels
router.post(
    "/",
    verifyToken,
    [
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel type is required'),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage('Price per Night is required and must be a number'),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage('Facilities are required'),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            // Handle validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const imageFiles = req.files as Express.Multer.File[];
            const newhotel: HotelType = req.body;

            // Upload images to Cloudinary
            const uploadPromises = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64");
                const dataURI = "data" + image.mimetype + ";base64," + b64;
                const result = await cloudinary.v2.uploader.upload(dataURI);
                return result.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            newhotel.imageUrls = imageUrls;
            newhotel.lastUpdated = new Date();
            newhotel.userId = req.userId;

            // Save new hotel in the database
            const hotel = new Hotel(newhotel);
            await hotel.save();

            // Return 201 status
            res.status(201).json(hotel);
        } catch (e:any) {
            console.error("Error creating hotel:", e);
            res.status(500).json({ message: "Something went wrong", error: e.message });
        }
    }
);

export default router;*/



/*import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../models/hotel";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// api/my-hotels
router.post(
    "/",
    verifyToken,
    [
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel type is required'),
        body("pricePerNight")
            .notEmpty().withMessage('Price per Night is required')
            .isNumeric().withMessage('Price per Night must be a number'),
        body("facilities")
            .notEmpty().withMessage('Facilities are required')
            .isArray().withMessage('Facilities must be an array'),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            // Handle validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const imageFiles = req.files as Express.Multer.File[];
            const newhotel: HotelType = req.body;

            // Upload images to Cloudinary
            const uploadPromises = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64");
                const dataURI = "data" + image.mimetype + ";base64," + b64;
                const result = await cloudinary.v2.uploader.upload(dataURI);
                return result.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            newhotel.imageUrls = imageUrls;
            newhotel.lastUpdated = new Date();
            newhotel.userId = req.userId;

            // Save new hotel in the database
            const hotel = new Hotel(newhotel);
            await hotel.save();

            // Return 201 status
            res.status(201).json(hotel);
        } catch (e:any) {
            console.error("Error creating hotel:", e);
            res.status(500).json({ message: "Something went wrong", error: e.message });
        }
    }
);

export default router;*/

