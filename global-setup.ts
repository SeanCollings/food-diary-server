export default () => {
  process.env.TZ = 'Africa/Johannesburg';
  process.env.DATABASE_URL = 'postgresql://';
  process.env.JWT_SECRET = 'test_secret';
};
