'use strict';

var MailsMapper = require('../mappers/mailsMapper');
var ContactsMapper = require('../mappers/contactsMapper');
var AttachmentsMapper = require('../mappers/attachmentsMapper');
var imapProvider  = require('../providers/imap');

// TODO refactoring --> toutes les fonctions qui font appel aux 'modèles' passent dans les mappers

exports.listAllContacts = function(req, res) {
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
  });
};

exports.createContact = function(req, res) {
  ContactsMapper.findOrCreate(req.body)
  .then(contact => {
    res.json(contact);
  })
  .catch(err => {
    res.send(err);
  });
};

// TODO
exports.listAllMails = function(req, res) {
  MailsMapper.listAllMails()
  .then(mails => {
    res.json(mails);
  })
  .catch(err => {
    res.send(err);
  });
};

// TODO gérer les PJ
exports.sendAnEmail = function(req, res) {
  MailsMapper.addNewMail(req.body.address, {
    body: req.body.body,
    subject: req.body.subject,
    toMe: false,
    treated: false,
    date: new Date()
  })
  .then(() => {
    MailsMapper.sendUntreatedMails().then(() => {
      res.json();
    })
  })
  .catch(err => {
    res.send(err);
  })
};

exports.listAllMailsByContact = function(req, res) {
  MailsMapper.listAllMailsByContact(req.params.address)
    .then(mails => {
      var promises = [];
      for (var i = 0; i < mails.length; i++)
        promises.push(AttachmentsMapper.listAttachmentsByMailId(mails[i].id));

      Promise.all(promises).then(results => {
        for (var i = 0; i < mails.length; i++) {
          mails[i].alcool = "yes";
          if (results[i] != undefined) {
            mails[i].dataValues.attachment = results[i];
          }
        }
        console.log(mails);
        res.send(mails);
      });

    }).catch(err => {
      res.send(err);
    });
};

// TODO
exports.sendAMailByContact = function(req, res) {

};

// TODO
exports.listNewEmails = function(req, res) {
  console.log("New emails from " + req.params.date);
};

// TODO
exports.listNewMailsByContact = function(req, res) {
  console.log("New emails from " + req.params.address + " (" + req.params.date + ") " );
};

exports.refreshMails = function(req, res) {
  MailsMapper.getLastReceivedMail().then(date => {
    imapProvider.getAllMailsSince(date, res);
  });
};

exports.testAttachment = function(req, res) {
  AttachmentsMapper.addAttachmentWithMailId(req.body.mailId, req.body)
    .then(() => {
      res.json();
    })
    .catch(err => {
      res.send(err);
    })
};
