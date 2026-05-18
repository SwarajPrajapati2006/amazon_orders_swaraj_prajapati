const express = require("express");
const { protect } = require("../middlewares/auth.middleware.js");
const { loginLimiter, otpLimiter, generalLimiter } = require("../middlewares/rateLimit.middleware.js");
const authController = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/register", generalLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", protect, authController.logout);

router.get("/profile", protect, authController.getProfile);
router.patch("/profile", protect, authController.updateProfile);
router.delete("/profile", protect, authController.deleteProfile);

router.post("/forgot-password", generalLimiter, authController.forgotPassword);
router.post("/reset-password", generalLimiter, authController.resetPassword);
router.post("/change-password", protect, authController.changePassword);

router.post("/verify-email", generalLimiter, authController.verifyEmail);

router.post("/send-otp", otpLimiter, authController.sendOtp);
router.post("/verify-otp", otpLimiter, authController.verifyOtp);

router.get("/sessions", protect, authController.getSessions);
router.delete("/sessions/:id", protect, authController.deleteSession);

router.post("/refresh-token", generalLimiter, authController.refreshToken);

module.exports = router;
