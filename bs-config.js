module.exports = {
  server: '.',
  port: 4000,
  middleware: function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  },
  ui: false,
  notify: false,
  open: false
};
