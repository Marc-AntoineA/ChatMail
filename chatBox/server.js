var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3000;

const logger = require('./logger').logger;

const smtp = require('./api/providers/smtp');
const settings = require('./settings');

app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', 'origin');
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '5mb'}));
app.use(cors());

var routes = require('./api/routes/routes');
routes(app);

app.listen(port);
logger.log({
  level: 'info',
  message: 'ChatBox écoute désormais sur le port : ' + port
});

function exitHandler() {
  console.log("EXIT");
  const errorMail = {
    to: settings.ERROR_MAIL_ADDRESS,
    from: settings.myAddress,
    text: 'Error',
    subject: 'A new error in the app',
    attachments: []
  };

  smtp.sendAnEmail(errorMail)
    .then(() => { console.log('email sent'); process.exit();})
    .catch(() => {console.log('mail failed'); process.exit();});
}

process.on('exit', exitHandler.bind());
