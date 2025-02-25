const db = require("../config/db");

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT id, cate_name, cate_desc, created_on, created_by FROM master_category"
    );
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
    const date = new Date();
    const created_on = date.toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query(
      "INSERT INTO master_category (cate_name, cate_desc, created_on) VALUES (?, ?, ?)",
      [cate_name, cate_desc, created_on]
    );

    res
      .status(201)
      .json({ id: result.insertId, message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update category
const updateCategory = async (req, res) => {
  const { cate_name, cate_desc } = req.body;
  const { id } = req.params;
  const [result] = await db.query(
    "UPDATE master_category SET cate_name = ?, cate_desc = ? WHERE id = ?",
    [cate_name, cate_desc, id]
  );
  res.status(200).json({ message: "Category updated successfully", result });
};

//delete category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const [result] = await db.query("DELETE FROM master_category WHERE id = ?", [
    id,
  ]);
  res.status(200).json({ message: "Category deleted successfully", result });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
