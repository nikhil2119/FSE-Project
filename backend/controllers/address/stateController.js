const db = require("../../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ message });
};

// Get all states
const getAllStates = async (req, res) => {
  try {
    const [states] = await db.query("SELECT id, state_name, country, created_on FROM master_state");

    if (states.length === 0) {
      return sendErrorResponse(res, 404, "No states found");
    }
    res.status(200).json({ states });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Get state by ID
const getStateById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "State ID is required");
  }

  try {
    const [state] = await db.query("SELECT id, state_name, country, created_on FROM master_state WHERE id = ?", [id]);

    if (state.length === 0) {
      return sendErrorResponse(res, 404, "State not found");
    }
    res.status(200).json({ state: state[0] });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Add state
const addState = async (req, res) => {
  const { state_name, country } = req.body;

  if (!state_name || !country) {
    return sendErrorResponse(res, 400, "State name and country are required");
  }

  try {
    const date = new Date();
    const created_on = date.toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query("INSERT INTO master_state (state_name, country, created_on) VALUES (?, ?, ?)", [state_name, country, created_on]);

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
    sendErrorResponse(res, 500, error.message);
  }
};

// Delete state
const deleteState = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "State ID is required");
  }

  try {
    const [result] = await db.query("DELETE FROM master_state WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return sendErrorResponse(res, 404, "State not found");
    }
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

module.exports = {
  getAllStates,
  getStateById,
  addState,
  deleteState,
};