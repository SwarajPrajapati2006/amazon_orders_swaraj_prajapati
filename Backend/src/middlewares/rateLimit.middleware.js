const requestMap = new Map();

const createLimiter = (maxRequests, windowMs) => (req, res, next) => {
  const key = req.ip + req.path;
  const now = Date.now();
  const record = requestMap.get(key) || { count: 0, startTime: now };
  
  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count++;
  }
  
  requestMap.set(key, record);
  
  if (record.count > maxRequests) {
    return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
  }
  
  next();
};

const loginLimiter = createLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const otpLimiter = createLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes
const generalLimiter = createLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes

module.exports = { loginLimiter, otpLimiter, generalLimiter };
