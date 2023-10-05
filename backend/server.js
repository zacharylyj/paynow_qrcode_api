//Zachary Leong Yao Jie 2023

var app = require('./controller/controller');

var port = 8081;
var host = 'localhost';

app.listen(port, host, function () {
  console.log(`Backend Server hosted at http://${host}:${port}/paynow/0/test`);
});
