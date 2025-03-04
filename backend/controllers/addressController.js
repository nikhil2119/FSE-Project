const db = require("../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ message });
};

// Get all addresses
const getAllAddress = async (req, res) => {
  try {
    const [address] = await db.query(
      "SELECT id, user_id, primary_addr, pin_code, city_id, state_id, created_on FROM user_address"
    );

    if (address.length === 0) {
      return sendErrorResponse(res, 404, "No Address found");
    }
    res.status(200).json({ addresses: address });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Get address by ID
const getAddressById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "Address ID is required");
  }

  try {
    const [address] = await db.query(
      "SELECT id, user_id, primary_addr, pin_code, city_id, state_id, created_on FROM user_address WHERE id = ?",
      [id]
    );

    if (address.length === 0) {
      return sendErrorResponse(res, 404, "Address not found");
    }
    res.status(200).json({ address: address[0] });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};


// Delete address
const deleteAddress = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendErrorResponse(res, 400, "Address ID is required");
  }

  try {
    const [result] = await db.query("DELETE FROM user_address WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return sendErrorResponse(res, 404, "Address not found");
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

module.exports = {
  getAllAddress,
  getAddressById,
  deleteAddress,
};
