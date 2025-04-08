import express from "express";
import multer from "multer";
import path from "path";
import { listFood, addFood, removeFood, getFoodById, getFoodsByCategory, updateFood } from "../controllers/foodController.js";

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Define routes
router.get("/list", listFood);
router.post("/add", upload.single("image"), handleMulterError, addFood);
router.delete("/remove", removeFood);
router.get("/:id", getFoodById);
router.get("/category/:category", getFoodsByCategory);
router.put("/update/:id", upload.single("image"), handleMulterError, updateFood);

export default router;