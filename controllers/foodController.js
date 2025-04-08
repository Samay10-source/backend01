import foodModel from "../models/foodModel.js";
import fs from 'fs';

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error("List food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve food items", 
            error: error.message 
        });
    }
}

// add food
const addFood = async (req, res) => {
    try {
        // Check if file exists in request
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "Image file is required" 
            });
        }
        
        const image_filename = req.file.filename;
        
        // Validate required fields
        if (!req.body.name || !req.body.price) {
            return res.status(400).json({ 
                success: false, 
                message: "Name and price are required fields" 
            });
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description || "",
            price: req.body.price,
            category: req.body.category || "Other",
            image: image_filename,
        });

        await food.save();
        res.status(201).json({ 
            success: true, 
            message: "Food item added successfully",
            foodId: food._id 
        });
    } catch (error) {
        console.error("Add food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to add food item", 
            error: error.message 
        });
    }
}

// delete food
const removeFood = async (req, res) => {
    try {
        // Check if ID is provided
        if (!req.body.id) {
            return res.status(400).json({ 
                success: false, 
                message: "Food ID is required" 
            });
        }

        const food = await foodModel.findById(req.body.id);
        
        // Check if food exists
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food item not found" 
            });
        }

        // Delete image file if it exists
        if (food.image) {
            const imagePath = `uploads/${food.image}`;
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== 'ENOENT') { // ENOENT means file doesn't exist
                    console.error("File deletion error:", err);
                    // Continue with deletion even if file removal fails
                }
            });
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({ 
            success: true, 
            message: "Food item deleted successfully" 
        });
    } catch (error) {
        console.error("Remove food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to delete food item", 
            error: error.message 
        });
    }
}

// get food by ID
const getFoodById = async (req, res) => {
    try {
        const foodId = req.params.id;
        
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required"
            });
        }
        
        const food = await foodModel.findById(foodId);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        console.error("Get food by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve food item",
            error: error.message
        });
    }
}

// get foods by category
const getFoodsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }
        
        const foods = await foodModel.find({ category: category });
        
        res.status(200).json({
            success: true,
            data: foods
        });
    } catch (error) {
        console.error("Get foods by category error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve food items by category",
            error: error.message
        });
    }
}

// update food
const updateFood = async (req, res) => {
    try {
        const foodId = req.params.id;
        
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required"
            });
        }
        
        const food = await foodModel.findById(foodId);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }
        
        // Update fields if provided
        const updateData = {};
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.price) updateData.price = req.body.price;
        if (req.body.category) updateData.category = req.body.category;
        
        // Handle image update if new file is uploaded
        if (req.file) {
            // Delete old image
            if (food.image) {
                const oldImagePath = `uploads/${food.image}`;
                fs.unlink(oldImagePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error("File deletion error:", err);
                    }
                });
            }
            
            // Set new image
            updateData.image = req.file.filename;
        }
        
        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId, 
            updateData, 
            { new: true } // Return updated document
        );
        
        res.status(200).json({
            success: true,
            message: "Food item updated successfully",
            data: updatedFood
        });
    } catch (error) {
        console.error("Update food error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update food item",
            error: error.message
        });
    }
}

export { listFood, addFood, removeFood, getFoodById, getFoodsByCategory, updateFood };