const authService = require("../services/auth.service.js");

const register = async (req, res) => {
  try {
    const data = await authService.registerUser(req.body, req);
    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body, req);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logoutUser(req.user.id);
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const data = await authService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await authService.deactivateProfile(req.user.id);
    res.status(200).json({
      success: true,
      message: "Account deactivated successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    // Always return success even if email not found
    res.status(200).json({
      success: true,
      message: "If this email exists, a password reset link has been sent"
    });
  } catch (error) {
    // Only catch actual errors, not "user not found"
    res.status(400).json({ success: false, message: error.message, error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password."
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message, error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again."
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message, error: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const maskedEmail = await authService.sendOtp(req.body.email);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully. Valid for 10 minutes.",
      data: {
        email: maskedEmail
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const data = await authService.verifyOtp(req.body);
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await authService.getSessions(req.user.id);
    res.status(200).json({
      success: true,
      message: "Active sessions fetched",
      data: {
        totalSessions: sessions.length,
        sessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    await authService.deleteSession(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Session removed successfully"
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const data = await authService.refreshToken(req.body.refreshToken);
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ success: false, message: error.message, error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp,
  verifyOtp,
  getSessions,
  deleteSession,
  refreshToken
};
