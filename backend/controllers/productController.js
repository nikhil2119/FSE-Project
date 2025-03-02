const db = require("../config/db");

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM master_products");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get product by id 
const getProductById = async (req, res) => {
  const { id } = req.params;
  const [product] = await db.query("SELECT * FROM master_products WHERE id = ?", [id]);
  res.status(200).json(product);
};

//add product   
const addProduct = async (req, res) => {
  const { cate_id, sub_cate_id, prod_name, prod_desc, prod_price, stock, created_on, created_by } = req.body;
  const [result] = await db.query("INSERT INTO master_products (cate_id, sub_cate_id, prod_name, prod_desc, prod_price, stock, created_on, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [cate_id, sub_cate_id, prod_name, prod_desc, prod_price, stock, created_on, created_by]);
  res.status(201).json({ id: result.insertId, message: "Product added successfully" });
};

//update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { cate_id, sub_cate_id, prod_name, prod_desc, prod_price, stock, created_on, created_by } = req.body;
  const [result] = await db.query("UPDATE master_products SET cate_id = ?, sub_cate_id = ?, prod_name = ?, prod_desc = ?, prod_price = ?, stock = ?, created_on = ?, created_by = ? WHERE id = ?", [cate_id, sub_cate_id, prod_name, prod_desc, prod_price, stock, created_on, created_by, id]);
  res.status(200).json({ message: "Product updated successfully" });
};

//delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const [result] = await db.query("DELETE FROM master_products WHERE id = ?", [id]);
  res.status(200).json({ message: "Product deleted successfully" });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

