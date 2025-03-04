const db = require("../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ message });
};

// Get all States
const getAllStates = async (req, res) => {
  try {
    const [states] = await db.query(
      "SELECT id, state_name, country, created_on FROM master_state"
    );

    if (states.length === 0) {
      return res.status(404).json({ message: "No states found" });
    }
    res.status(200).json({ states });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get State by ID
const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "State ID is required" });
    }

    const [state] = await db.query(
      "SELECT id, state_name, country, created_on FROM master_state WHERE id = ?",
      [id]
    );

    if (state.length === 0) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({ state: state[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add state
const addState = async (req, res) => {
  try {
    const { state_name, country } = req.body;

    // Validate required fields
    if (!state_name || !country) {
      return res.status(400).json({ message: "State name and country are required" });
    }

    const date = new Date();
    const created_on = date.toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query(
      "INSERT INTO master_state (state_name, country, created_on) VALUES (?, ?, ?)",
      [state_name, country, created_on]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: "State created successfully",
      state: {
        id: result.insertId,
        state_name,
        country,
        created_on
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete State
const deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "State ID is required" });
    }

    const [result] = await db.query("DELETE FROM master_state WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStates,
  getStateById,
  addState,
  deleteState,
};