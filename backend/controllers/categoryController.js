const db = require("../config/db");

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT id, cate_name, cate_desc, created_on, created_by FROM master_category"
    );

    if (categories.length === 0) {
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
    const [category] = await db.query(
      "SELECT id, cate_name, cate_desc, created_on, created_by FROM master_category WHERE id = ?",
      [req.params.id]
    );

    if (category.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//add category
const createCategory = async (req, res) => {
  try {
    const { cate_name, cate_desc } = req.body;

    // Validate required fields
    if (!cate_name || !cate_desc) {
      return res.status(400).json({ message: "Category name and description are required" });
    }

    const date = new Date();
    const created_on = date.toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query(
      "INSERT INTO master_category (cate_name, cate_desc, created_on) VALUES (?, ?, ?)",
      [cate_name, cate_desc, created_on]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: "Category created successfully",
      category: {
        id: result.insertId,
        cate_name,
        cate_desc,
        created_on
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update category
const updateCategory = async (req, res) => {
  try {
    const { cate_name, cate_desc } = req.body;
    const { id } = req.params;

    // Validate required fields
    if (!cate_name || !cate_desc) {
      return res.status(400).json({ message: "Category name and description are required" });
    }

    // Check if category exists
    const [existing] = await db.query("SELECT id FROM master_category WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const [result] = await db.query(
      "UPDATE master_category SET cate_name = ?, cate_desc = ? WHERE id = ?",
      [cate_name, cate_desc, id]
    );

    res.status(200).json({ 
      message: "Category updated successfully",
      category: {
        id,
        cate_name,
        cate_desc
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const [result] = await db.query("DELETE FROM master_category WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

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
  deleteCategory,
};
