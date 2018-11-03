'use strict';

var Mail = require('../models/mailModel').Mail;
var Contact = require('../models/contactModel').Contact;
var ContactsMapper = require('../mappers/contactsMapper');

// Obtenir tous les mails d'une personne
exports.listAllMailsByContact = function(contactAdress) {
  return Contact.find({where: { adress: contactAdress }})
    .then(contact => {
      return Mail.findAll(
        {
          where: { recipient: contact.id },
          order: [['date', 'DESC']]
        });
    })
    .catch(err => {
        throw err;
    });
};

// Obtenir tous les mails d'une personne, depuis une certaine date
exports.listAllMailsByContactSince = function(contactAdress, begin) {
  return Contact.find( { where: { adress: contactAdress }})
    .then(contact => {
      return Mail.findAdd()
    });
};

// Obtenir tous les mails disponibles
exports.listAllMails = function() {
  return Mail.findAll();
};

// TODO
// Obtenir tous les mails disponibles, depuis une certaine date
exports.listAllMailsSince = function (begin) {
  return Mail.findAll();
};

exports.getMailById = function(id) {
  return Mail.find({ where: {id: id}});
};

// TODO
exports.getUnTreatedMails = function() {

};

// Ajouter un mail
// Mail = object js avec les bonnes structures
exports.addNewMail = function (contactAdress, mail){
  ContactsMapper.createContactOrNull({adress: contactAdress}).then(contact => {
      mail.recipient = contact.id;
      Mail.create(mail).then( () => {
        console.log("success");
      }).catch(err => {
        console.log(err);
      });
  });
};

// TODO s'assurer que pas le premier mail
exports.getLastReceivedMail = function () {
  return Mail.findAll({
    where: { toMe: true },
    order: [['date', 'ASC']]
  }).then(mails => {
    if (mails.length == 0)
      return new Date('2000, May 20');
    return mails[0].date;
  });
}
