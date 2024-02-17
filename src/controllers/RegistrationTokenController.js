const RegistrationToken = require('../models/RegistrationToken');

class RegistrationTokenController {
  async createToken(userData) {
    try {
      const newToken = new RegistrationTokenDAO(userData);
      return await newToken.save();
    } catch (error) {
      throw error;
    }
  }
  
}

module.exports = RegistrationTokenController;
