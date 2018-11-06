'use strict';

var MailsMapper = require('../mappers/mailsMapper');
var ContactsMapper = require('../mappers/contactsMapper');
var AttachmentsMapper = require('../mappers/attachmentsMapper');
var imapProvider  = require('../providers/imap');

// TODO refactoring --> toutes les fonctions qui font appel aux 'modèles' passent dans les mappers

exports.listAllContacts = function(req, res) {
  ContactsMapper.listAllContacts()
  .then(contacts => {
    res.json(contacts);
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
        res.json(mails);
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
