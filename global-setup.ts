export default () => {
  process.env.TZ = 'UTC';
  process.env.DATABASE_URL = 'postgresql://';
  process.env.JWT_SECRET = 'test_secret';
};
