const db = require("../../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ message });
};

// Get all cities
const getAllCities = async (req, res) => {
  try {
    const [cities] = await db.query("SELECT id, city, state_id, created_on FROM master_city");

    if (cities.length === 0) {
      return sendErrorResponse(res, 404, "No cities found");
    }
    res.status(200).json({ cities });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Get city by ID
const getCityById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "City ID is required");
  }

  try {
    const [city] = await db.query("SELECT id, city, state_id, created_on FROM master_city WHERE id = ?", [id]);

    if (city.length === 0) {
      return sendErrorResponse(res, 404, "City not found");
    }
    res.status(200).json({ city: city[0] });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Add city
const addCity = async (req, res) => {
  const { city, state_id } = req.body;

  if (!city || !state_id) {
    return sendErrorResponse(res, 400, "City name and state ID are required");
  }

  try {
    const date = new Date();
    const created_on = date.toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query("INSERT INTO master_city (city, state_id, created_on) VALUES (?, ?, ?)", [city, state_id, created_on]);

    res.status(201).json({
      id: result.insertId,
      message: "City created successfully",
      city: {
        id: result.insertId,
        city,
        state_id,
        created_on
      }
    });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Delete city
const deleteCity = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "City ID is required");
  }

  try {
    const [result] = await db.query("DELETE FROM master_city WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return sendErrorResponse(res, 404, "City not found");
    }
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

module.exports = {
  getAllCities,
  getCityById,
  addCity,
  deleteCity,
};
