//qrcode gen
// #7d1979
const express = require('express');
const bodyParser = require('body-parser');
const PaynowQR = require('paynowqr');
const QRCode = require('qrcode');
const sharp = require('sharp');
const mw = express();

uen = '201608445Z';
reciever_name = 'ACES CARE Limited';

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

    sharp(buffer)
      .resize(500, 500)
      .toBuffer()
      .then((newBuffer) => {
        // Convert buffer to Data URL
        let imgSrc = 'data:image/png;base64,' + newBuffer.toString('base64');

        // Create HTML to embed image and add text below it
        let html = `
          <html>
            <head>
              <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
            </head>
            <body style="text-align: center; background-color: black; color: white; font-family: 'Montserrat', sans-serif;">
              <div style="width: 500px; margin: auto;">
                <img src="${imgSrc}" alt="QR Code" style="width: 100%;"/><br/>
                <p style="font-size: 32px; text-align: left; padding-top: 30px; padding-left: 10px; margin: 0;"><strong>${reciever_name}</strong></p>
                <p style="font-size: 24px; text-align: left; padding-top: 5px; padding-left: 30px; margin: 0;">UEN: <strong>${uen}</strong><br/>Amount: <strong>$${amount}</strong></p>
              </div>
            </body>
          </html>`;

        // Send HTML in response
        res.send(html);
      })
      .catch((err) => {
        res.status(500).send('Error Occured');
      });
  });
});

module.exports = mw;
