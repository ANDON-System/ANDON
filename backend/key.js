const jwt = require('jsonwebtoken');

// Define your specific secret key
const secretKey = 'andon-system'; // Use a strong, random key in production

// Payload (data to encode in token)
const payload = {
  userId: 101,
  username: 'shreya'
};

// Create the token
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('JWT Token:', token);
