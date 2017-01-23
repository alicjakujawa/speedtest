// ---------------------------------------
// Require Tests
// ---------------------------------------

// require all `tests/**/*.perf.js`
const testsContext = require.context('./', true, /\.perf\.js$/)
testsContext.keys().forEach(testsContext)
