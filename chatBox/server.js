var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3300;

var logger = require('./logger').logger;

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
