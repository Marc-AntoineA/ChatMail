'use strict';

var MailsMapper = require('../mappers/mailsMapper');
var ContactsMapper = require('../mappers/contactsMapper');
var AttachmentsMapper = require('../mappers/attachmentsMapper');
var imapProvider  = require('../providers/imap');
var settings = require('../../settings');
var logger = require('../../logger').logger;

var checkToken = function(req, res) {
  let header = req.get('Authorization');
  if (header == undefined){
    res.status(403);
    res.send('No token provided');
    logger.log({
      level: 'error',
      message: 'no token provided for request: ' + req.originalUrl + ' with ip: ' + req.ip
    });
    return false;
  }

  if('Token ' + settings.DEFAULT_TOKEN != header) {
    res.status(403);
    res.send('Token invalid');
    logger.log({
      level: 'error',
      message: 'token invalid used: ' + header
    });
    return false;
  }
  return true;
}

exports.getAttachmentsByMail = function(req, res) {
  if (!checkToken(req, res)) return;
  AttachmentsMapper.listAttachmentsByMailId(req.params.mail).then(attachments => {
    res.json(attachments);
  })
  .catch(err => {
    res.send(err);
    logger.log({
      level: 'error',
      message: 'Error in getAttachmentsByMailId for mailId: ' + req.params.mail + '(' + err + ')'
    });
  });
};

exports.listAllContacts = function(req, res) {
  if (!checkToken(req, res)) return;
  ContactsMapper.listAllContacts()
  .then(contacts => {
    var promises = [];
    for (var index = 0; index < contacts.length; index++) {
      promises.push(MailsMapper.getDateOfLastMailWithContactId(contacts[index].id));
    }

    Promise.all(promises).then(values => {
      var newContacts = [];
      for (var index = 0; index < contacts.length; index++) {
        newContacts.push({
          address: contacts[index].address,
          forename: contacts[index].forename,
          name: contacts[index].name,
          date: values[index]
        });
      }
      newContacts.sort(function(a, b){ return a.date <= b.date;});
      res.json(newContacts);
    });
  })
  .catch(err => {
    res.send(err);
    logger.log({
      level: 'error',
      message: 'Error in listAllContacts: ' + err
    });
  });
};

exports.createContact = function(req, res) {
  if (!checkToken(req, res)) return;
  ContactsMapper.findOrCreate(req.body)
  .then(contact => {
    res.json(contact);
  })
  .catch(err => {
    res.send(err);
    logger.log({
      level: 'error',
      message: 'Error in createContact for contact ' + req.body.address + '(' + err + ')'
    });
  });
};

exports.listAllMails = function(req, res) {
  if (!checkToken(req, res)) return;
  MailsMapper.listAllMails()
  .then(mails => {
    res.json(mails);
  })
  .catch(err => {
    res.send(err);
    logger.log({
      level: 'error',
      message: 'Error in listAllMails'
    });
  });
};

// TODO gérer les PJ
exports.sendAnEmail = function(req, res) {
  if (!checkToken(req, res)) return;

  MailsMapper.addNewMail(req.body.address, {
    body: req.body.body,
    subject: req.body.subject == undefined ? settings.DEFAULT_SUBJECT : req.body.subject,
    toMe: false,
    treated: false,
    date: new Date()
  })
  .then(mailId => {
    if (req.body.attachment == undefined){
      MailsMapper.sendUntreatedMails();
      res.json();
    } else {
      AttachmentsMapper.addAttachmentWithMailId(mailId, req.body.attachment).then(() => {
        MailsMapper.sendUntreatedMails();
        res.json();
      });
    }
  })
  .catch(err => {
    res.send(err);
    logger.log({
      level: 'error',
      message: 'Error in send a mail ' + err
    })
  })
};

exports.listAllMailsByContact = function(req, res) {
  if (!checkToken(req, res)) return;
  MailsMapper.listAllMailsByContact(req.params.address)
    .then(mails => {
      var promises = [];
      for (var i = 0; i < mails.length; i++)
        promises.push(AttachmentsMapper.listAttachmentsByMailId(mails[i].id));

      Promise.all(promises).then(results => {
        for (var i = 0; i < mails.length; i++) {
          if (results[i] != undefined) {
            mails[i].dataValues.numberAttachments = results[i].length;
          }
        }
        res.send(mails);
      });

    }).catch(err => {
      res.send(err);
      logger.log({
        level: 'error',
        message: 'In listAllMailsByContact for: ' + req.params.address + ' -- ' + err
      });
    });
};

// TODO
exports.sendAMailByContact = function(req, res) {
  if (!checkToken(req, res)) return;
  logger.log({
    level: 'warn',
    message: 'Appel à la fonction sendAMailByContact non définie pour le moment'
  });
};

// TODO
exports.listNewEmails = function(req, res) {
  if (!checkToken(req, res)) return;
  logger.log({
    level: 'warn',
    message: 'Appel à la fonction listNewEmails non définie pour le moment'
  });
};

// TODO
exports.listNewMailsByContact = function(req, res) {
  if (!checkToken(req, res)) return;
  logger.log({
    level: 'warn',
    message: 'Appel à la fonction listNewMailsByContact non définie pour le moment'
  });
};

exports.refreshMails = function(req, res) {
  if (!checkToken(req, res)) return;
  MailsMapper.getLastReceivedMail().then(date => {
    imapProvider.getAllMailsSince(date, res);
  }).catch(err => {
    res.send(err);
    logger.log({
      level: 'error',
      message: 'Erreur dans la fonction refreshMails / getLastRecevoidMail ou getAllMailSince : ' +  err
    });
  })
};

exports.testAttachment = function(req, res) {
  logger.log({
    level: 'warn',
    message: 'La fonction testAttachment ne doit pas être utilisée'
  });
  if (!checkToken(req, res)) return;
  AttachmentsMapper.addAttachmentWithMailId(req.body.mailId, req.body)
    .then(() => {
      res.json();
    })
    .catch(err => {
      res.send(err);

    });
};
