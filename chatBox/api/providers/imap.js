// Contient des fonctions pour accéder aux derniers mails et les parser
// pour les mettre dans la base de données
// Dans un premier temps, uniquement à la demande du client (aucun refresh
// automatique de prévu).

var inspect = require('util').inspect;

var imap = require('../../settings').imap;
var fs = require('fs'), fileStream;
const simpleParser = require('mailparser').simpleParser;
impor

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

// À sauvegarder dans la base de données
// --> text (+ textAsHtml)
// --> subject
// --> date
// --> to.text
// --> from.text

exports.getAllMailsSince = function(date) {
  imap.connect();
  imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      imap.search([['SINCE', date]], function(err, results) {
        if (err) throw err;
        var f = imap.fetch(results, { bodies: '' });

        f.on('message', function(msg, seqno) {
          console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';

          msg.on('body', function(stream, info) {
            simpleParser(stream)
              .then(parsed => {
                fs.writeFile('mails/msg-' + seqno + '-body.json', JSON.stringify(parsed), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
              })
              .catch(err => {console.log(err);});
            //stream.pipe(fs.createWriteStream('mails/msg-' + seqno + '-body.txt'));
          });

          msg.once('attributes', function(attrs) {
            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
          });

          msg.once('end', function() {
            console.log(prefix + 'Finished');
          });
        });

        f.once('error', function(err) {
          console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
          console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });0
    });
  }
