import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add Food item
const addFood = async (req, res) => {
    const image_filename = req.file ? req.file.filename : "";  // Handling if req.file is undefined
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });
    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding food item", error: err });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const food = await foodModel.find();
        res.status(200).json({ success: true, data: food });
    } catch (err) {
        res.status(500).json({ message: "Error fetching food items", error: err });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            fs.unlink(`uploads/${food.image}`, () => {});
            await foodModel.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, message: "Food item removed successfully" });
        } else {
            res.status(404).json({ success: false, message: "Food item not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Error removing food item", error: err });
    }
};

export { addFood, listFood, removeFood };
