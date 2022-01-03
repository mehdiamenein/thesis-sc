module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'cd90011d434ae76bd14b49304f1c01c9'),
  },
});
