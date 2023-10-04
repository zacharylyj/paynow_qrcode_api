//qrcode gen

var express = require('express');
var bodyParser = require('body-parser');
const PaynowQR = require('paynowqr');
var QRCode = require('qrcode');

var mw = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
mw.use(urlencodedParser);
mw.use(bodyParser.json());

var cors = require('cors');
mw.use(cors());

mw.get('/paynow/:amount/:ref', function (req, res) {
  var amount = req.params.amount;
  var ref = req.params.ref;
  let qr_code = new PaynowQR({
    uen: '201608445Z',
    amount: amount,
    editable: false,
    expiry: '',
    refNumber: ref,
    company: 'ACES CARE',
  });

  QRCode.toBuffer(qr_code.output(), function (err, buffer) {
    if (err) {
      return res.status(500).send('Error Occured');
    }

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  });
});

module.exports = mw;
