const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model.js");
const Session = require("../models/session.model.js");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

const verificationEmail = (name, token) => `
  <h2>Hello ${name},</h2>
  <p>Please click the link below to verify your email address:</p>
  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${token}">Verify Email</a>
`;

const passwordResetEmail = (name, token) => `
  <h2>Hello ${name},</h2>
  <p>Please click the link below to reset your password:</p>
  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset?token=${token}">Reset Password</a>
`;

const otpEmail = (name, otp) => `
  <h2>Hello ${name},</h2>
  <p>Your OTP for verification is: <strong>${otp}</strong></p>
  <p>This OTP is valid for 10 minutes.</p>
`;

const welcomeEmail = (name) => `
  <h2>Welcome to Amazon Orders, ${name}!</h2>
  <p>We're excited to have you on board.</p>
`;

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );
};

const generateTokenPair = (userId, role) => ({
  accessToken: generateAccessToken(userId, role),
  refreshToken: generateRefreshToken(userId)
});

const maskEmail = (email) => {
  const [local, domain] = email.split("@");
  return local[0] + "***" + "@" + domain;
};

const registerUser = async (data, req) => {
  const { name, email, password, confirmPassword } = data;

  if (!name || !email || !password || !confirmPassword) {
    throw new Error("All fields are required");
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!passwordRegex.test(password)) {
    throw new Error("Password must contain at least one uppercase letter, one number, and one special character");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000
  });

  await sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: verificationEmail(name, token)
  });

  const { accessToken, refreshToken } = generateTokenPair(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const sessionToken = crypto.randomBytes(64).toString("hex");
  
  await Session.create({
    userID: user._id,
    sessionToken: sessionToken,
    deviceInfo: req.headers["user-agent"]?.substring(0, 100) || "Unknown",
    ipAddress: req.ip || req.connection?.remoteAddress || "Unknown IP",
    userAgent: req.headers["user-agent"] || "Unknown",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    },
    accessToken,
    refreshToken
  };
};

const loginUser = async (data, req) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Both fields are required");
  }

  const user = await User.findOne({ email }).select("+password");
  
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("Account deactivated");
    error.statusCode = 403;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokenPair(user._id, user.role);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const sessionToken = crypto.randomBytes(64).toString("hex");

  await Session.create({
    userID: user._id,
    sessionToken: sessionToken,
    deviceInfo: req.headers["user-agent"]?.substring(0, 100) || "Unknown",
    ipAddress: req.ip || req.connection?.remoteAddress || "Unknown IP",
    userAgent: req.headers["user-agent"] || "Unknown",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin
    },
    accessToken,
    refreshToken
  };
};

const logoutUser = async (userId) => {
  await Session.updateMany({ userID: userId }, { isActive: false });
  
  const user = await User.findById(userId).select("+refreshToken");
  if (user) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  }
};

const getProfile = async (userId) => {
  return await User.findById(userId).select("id name email role isEmailVerified lastLogin createdAt").lean();
};

const updateProfile = async (userId, data) => {
  const { name, email } = data;
  
  const updateData = {};
  
  if (name) {
    if (name.length < 2 || name.length > 50) {
      throw new Error("Name must be between 2 and 50 characters");
    }
    updateData.name = name;
  }
  
  if (email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      throw error;
    }
    updateData.email = email;
  }
  
  if (Object.keys(updateData).length === 0) {
    return await User.findById(userId).select("-password").lean();
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password").lean();
  return updatedUser;
};

const deactivateProfile = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");
  if (user) {
    user.isActive = false;
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    
    await Session.updateMany({ userID: userId }, { isActive: false });
  }
};

const forgotPassword = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: passwordResetEmail(user.name, token)
    });
  }
  return true;
};

const resetPassword = async (data) => {
  const { token, newPassword, confirmPassword } = data;

  if (!token || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error("Password must contain at least one uppercase letter, one number, and one special character");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+password");

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return true;
};

const changePassword = async (userId, data) => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  const user = await User.findById(userId).select("+password");
  
  if (!(await user.comparePassword(currentPassword))) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error("Password must contain at least one uppercase letter, one number, and one special character");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  user.password = newPassword;
  await user.save();

  await Session.updateMany({ userID: userId }, { isActive: false });

  return true;
};

const verifyEmail = async (token) => {
  if (!token) throw new Error("Token is required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error("Invalid or expired verification token");
  }

  if (user.isEmailVerified) {
    throw new Error("Email already verified");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Welcome to Amazon Orders!",
    html: welcomeEmail(user.name)
  });

  return true;
};

const sendOtp = async (email) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.otp = hashedOtp;
  const expirationMinutes = Number(process.env.OTP_EXPIRES_MINUTES) || 10;
  user.otpExpires = Date.now() + expirationMinutes * 60 * 1000;
  user.otpVerified = false;
  
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    html: otpEmail(user.name, otp)
  });

  return maskEmail(email);
};

const verifyOtp = async (data) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email }).select("+otp +otpExpires +otpVerified");
  
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.otp) {
    throw new Error("No OTP found. Please request a new one.");
  }

  if (user.otpExpires < Date.now()) {
    throw new Error("OTP expired. Please request a new one.");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  
  if (hashedOtp !== user.otp) {
    throw new Error("Invalid OTP");
  }

  user.otpVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { email: user.email, otpVerified: true };
};

const getSessions = async (userId) => {
  return await Session.find({ userID: userId, isActive: true }).select("-sessionToken").lean();
};

const deleteSession = async (userId, sessionId) => {
  const session = await Session.findOne({ _id: sessionId, userID: userId });
  if (!session) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }
  
  session.isActive = false;
  await session.save();
  return true;
};

const refreshToken = async (token) => {
  if (!token) throw new Error("Refresh token is required");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  
  if (!user || user.refreshToken !== token) {
    const error = new Error("Refresh token mismatch");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id, user.role);

  return { accessToken };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  deactivateProfile,
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
