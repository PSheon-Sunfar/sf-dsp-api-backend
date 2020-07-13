module.exports = {
  // APP
  APP_URL: process.env.MONGO_URI || 'http://localhost',

  // Azure Service
  AZURE_STORAGE_SAS_KEY:
    process.env.AZURE_STORAGE_SAS_KEY || 'YOURAZURESTORAGEKEY',
  AZURE_STORAGE_ACCOUNT:
    process.env.AZURE_STORAGE_ACCOUNT || 'YOURAZURESTORAGEACCOUNT',

  // DATABASE
  MONGO_URI:
    process.env.MONGO_URI || 'mongodb://localhost:27017/YOURMONGODBNAME',

  // AUTH
  WEBTOKEN_SECRET_KEY:
    process.env.WEBTOKEN_SECRET_KEY || 'YOURJWTSECRETCHANGEIT',
  WEBTOKEN_EXPIRATION_TIME: process.env.WEBTOKEN_EXPIRATION_TIME || '36000',
};
