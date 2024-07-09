/*Environment variables configuration*/ 
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const loadEnvVariables = () => {
  const envPath = path.join(__dirname, '..', '.env');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
  } else {
    console.log('.env file loaded successfully');
  }
};

module.exports = loadEnvVariables;
