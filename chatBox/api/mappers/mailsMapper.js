'use strict';

var Models = require('../models/models');

// Obtenir tous les mails d'une personne
exports.listAllMailsByContact = function(contactAdress) {
  Models.Contact.find({where: { adress: contactAdress }})
    .then(contact => {
      return Models.Mail.findAll(
        {
          where: { recipient: contact.id },
          order: [['date', 'DESC']]
        });
    })
    .catch(err => {
        throw err;
    });
};

// TODO
// Obtenir tous les mails d'une personne, depuis une certaine date
exports.listAllMailsByContactSince = function(contactAdress, begin) {
  Models.Contact.find( { where: { adress: contactAdress }})
    .then(contact => {
      return Models.Mail.findAdd()
    });
};

// Obtenir tous les mails disponibles
exports.listAllMails = function() {
  return Models.Mail.findAll();
};

// TODO
// Obtenir tous les mails disponibles, depuis une certaine date
exports.listAllMailsSince = function (begin) {
  return Models.Mail.findAll();
};

// TODO
exports.getMailById = function() {

};

// TODO
exports.getUnTreatedMails = function() {

};

// Ajouter un mail
// Mail = object js avec les bonnes structures
exports.addNewMail = function (contactAdress, mail){

};
