'use strict';

var Models = require('../models/models');  // TODO remove
var MailsMapper = require('../mappers/mailsMapper');
var ContactsMapper = require('../mappers/contactsMapper');
var AttachmentsMapper = require('../mappers/AttachmentsMapper');
var imapProvider  = require('../providers/imap');

// TODO refactoring --> toutes les fonctions qui font appel aux 'modèles' passent dans les mappers

exports.listAllContacts = function(req, res) {
  Models.Contact.findAll({attributes: ['adress', 'name', 'forename']})
    .then(contacts => {
      res.json(contacts);
    });
};

// TODO
exports.createContact = function(req, res) {
  console.log("Create a new contact");
};

// TODO
exports.listAllMails = function(req, res) {
  Models.Mail.findAll().then(mails => {
    res.json(mails);
  });
};

// TODO
exports.sendAnEmail = function(req, res) {

};

exports.listAllMailsByContact = function(req, res) {
  MailsMapper.listAllMailsByContact(req.params.adress)
    .then( mails => {
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
  console.log("New emails from " + req.params.adress + " (" + req.params.date + ") " )
};


exports.refreshMails = function(req, res) {
  imapProvider.getAllMailsSince('May 20, 2010');
};
