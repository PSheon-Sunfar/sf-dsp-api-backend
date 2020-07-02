module.exports = {
  // APP
  APP_URL: process.env.MONGO_URI || 'http://localhost',

  // DATABASE
  MONGO_URI:
    process.env.MONGO_URI || 'mongodb://localhost:27017/YOURMONGODBNAME',

  // AUTH
  WEBTOKEN_SECRET_KEY:
    process.env.WEBTOKEN_SECRET_KEY || 'YOURJWTSECRETCHANGEIT',
  WEBTOKEN_EXPIRATION_TIME: process.env.WEBTOKEN_EXPIRATION_TIME || '36000',
};
