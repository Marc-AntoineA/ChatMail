'use strict';

var Mail = require('../models/mailModel').Mail;
var Contact = require('../models/contactModel').Contact;
var ContactsMapper = require('../mappers/contactsMapper');

// Obtenir tous les mails d'une personne
exports.listAllMailsByContact = function(contactAddress) {
  return Contact.find({where: { address: contactAddress }})
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
exports.listAllMailsByContactSince = function(contactAddress, begin) {
  return Contact.find( { where: { address: contactAddress }})
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
exports.addNewMail = function (contactAddress, mail){
  ContactsMapper.createContactOrNull({address: contactAddress}).then(contact => {
      mail.recipient = contact.id;
      Mail.create(mail).then( () => {
        console.log("success");
      }).catch(err => {
        console.log(err);
      });
  });
};

// TODO on devrait pouvoir faire ça plus facilement...
exports.getLastReceivedMail = function () {
  return Mail.findAll({
    where: { toMe: true },
    order: [['date', 'DESC']]
  }).then(mails => {
    if (mails.length == 0)
      return new Date('2000, May 20');
    return mails[0].date;
  });
}
