'use strict';
// Contient des fonctions pour accéder aux derniers mails et les parser
// pour les mettre dans la base de données
// Dans un premier temps, uniquement à la demande du client (aucun refresh
// automatique de prévu).

var inspect = require('util').inspect;

var imap = require('../../settings').imap;
var fs = require('fs'), fileStream;
var MailsMapper = require('../mappers/mailsMapper');
var AttachmentsMapper = require('../mappers/attachmentsMapper');
var encoding = require('./encoding');

const simpleParser = require('mailparser').simpleParser;

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

function saveMailIntoDatabase(mail) {

  console.log("saveMailIntoDatabase");

  var newMail = {};
  var address  = encoding.fromQp(mail.from.value[0].address);
  console.log("address");
  if (address == "addresse.de.test.785@gmail.com") return;

  console.log("address diff");
  if (mail.text != undefined)
    newMail.body = encoding.fromQp(mail.text);
  else
    newMail.body = "";

  newMail.subject = encoding.fromQp(mail.subject);
  newMail.date = mail.date;
  newMail.treated = true;
  newMail.toMe = true;

  MailsMapper.addNewMail(address, newMail)
    .then((mailId) => {
      var attachments = mail.attachments;
      if (attachments == undefined) return;
      for (var i = 0; i < attachments.length; i++) {
        var attachment = attachments[i];
        console.log(attachment);
        var newAttachment = {
          size: attachment.size,
          contentType: attachment.contentType,
          checkSum: attachment.checksum
        };

        if (attachment.filename != undefined)
          newAttachment.fileName  = attachment.filename;

        newAttachment.data = attachment.content.toString('base64');

        AttachmentsMapper.addAttachmentWithMailId(mailId, newAttachment);
      }
    })
    .catch(err => {
      console.log(err);
    }); // Faire en sorte d'éviter les doublons
}


function saveMailIntoFile(msg, seqno) {
  fs.writeFile('mails/msg-' + seqno + '-body.json', JSON.stringify(parsed), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}

// À sauvegarder dans la base de données
// --> text (+ textAsHtml)
// --> subject
// --> date
// --> to.text
// --> from.text
exports.getAllMailsSince = function(date, res) {
  imap.connect();
  imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      imap.search([['SINCE', date]], function(err, results) {
        var n = 0;
        if (err) throw err;
        var f = imap.fetch(results, { bodies: '' });

        f.on('message', function(msg, seqno) {
          var prefix = '(#' + seqno + ') ';

          msg.on('body', function(stream, info) {

            simpleParser(stream)
              .then(parsed => {
                n += 1;
                saveMailIntoDatabase(parsed);
              })
              .catch(err => {
                res.send(err);
              });
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
          imap.end();
          res.json({n:n});
        });
      });
    });
  });
}
