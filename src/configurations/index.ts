export default () => ({
  port: process.env.PORT || 4000,
  cript_salt: process.env.CRYPT_SALT,
  secret_key_jwt: process.env.JWT_SECRET_KEY,
  secret_refresh_key_jwt: process.env.JWT_SECRET_REFRESH_KEY,
  expire_token: process.env.TOKEN_EXPIRE_TIME,
  expire_refresh_token: process.env.TOKEN_REFRESH_EXPIRE_TIME,
});
