const { Category } = require('../models');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'cate_name', 'cate_desc', 'created_on', 'created_by']
        });

        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }
        
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            attributes: ['id', 'cate_name', 'cate_desc', 'created_on', 'created_by']
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add category
const createCategory = async (req, res) => {
    try {
        const { cate_name, cate_desc } = req.body;

        // Validate required fields
        if (!cate_name || !cate_desc) {
            return res.status(400).json({ message: "Category name and description are required" });
        }

        const category = await Category.create({
            cate_name,
            cate_desc,
            created_by: req.user?.id
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { cate_name, cate_desc } = req.body;
        const { id } = req.params;

        // Validate required fields
        if (!cate_name || !cate_desc) {
            return res.status(400).json({ message: "Category name and description are required" });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.update({
            cate_name,
            cate_desc
        });

        res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.destroy();

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
