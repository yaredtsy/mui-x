module.exports = {
  recursive: true,
  slow: 500,
  timeout: (process.env.CIRCLECI === 'true' ? 5 : 2) * 1000, // Circle CI has low-performance CPUs.
  require: [require.resolve('@babel/register')],
};
