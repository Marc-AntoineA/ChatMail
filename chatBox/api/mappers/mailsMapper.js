'use strict';

var Mail = require('../models/mailModel').Mail;
var Contact = require('../models/contactModel').Contact;
var ContactsMapper = require('../mappers/contactsMapper');
var smtp = require('../providers/smtp');
var settings = require('../../settings');

// Obtenir tous les mails d'une personne
exports.listAllMailsByContact = function(contactAddress) {
  return Contact.find({where: { address: contactAddress }})
    .then(contact => {
      return Mail.findAll(
        {
          where: { recipient: contact.id },
          order: [['date', 'ASC']]
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

// Ajouter un mail
// Mail = object js avec les bonnes structures
// Warning. si déjà créé, renvoie true
exports.addNewMail = function (contactAddress, mail){

  return new Promise((resolve, reject) => {
    ContactsMapper.findOrCreate({address: contactAddress}).then(results => {
        var contact = results[0];
        mail.recipient = contact.id;
        Mail.findOrCreate({
          where:{
              recipient: mail.recipient,
              date: mail.date,
              subject: mail.subject,
              body: mail.body,
              toMe: mail.toMe,
              treated: mail.treated
          }
        })
        .spread((mail, created) => {
          if (created)
            resolve(mail.id);
          else
            resolve(undefined);
        });
      })
      .catch( err => {
        reject(err);
      });
    });
};

// TODO on devrait pouvoir faire ça plus facilement...
/* TODO regarder ça
Project.min('age', { where: { age: { $gt: 5 } } }).then(function(min) {
  // will be 10
})
*/
exports.getLastReceivedMail = function () {
  return Mail.findAll({
    where: { toMe: true },
    order: [['date', 'DESC']]
  }).then(mails => {
    if (mails.length == 0)
      return new Date('2000, May 20');
    return mails[0].date;
  });
};

exports.sendUntreatedMails = function () {
  console.log("Sending untreated mails");
  Mail.findAll({
    where: {
      toMe: false,
      treated: false
    }})
    .then(mails => {
      for (var index = 0; index < mails.length; index++) {
        var mail = mails[index];
        ContactsMapper.getContactById(mail.recipient)
        .then(contact => {
          var newMail = {
            to: contact.address,
            from: settings.myAddress,
            text: mail.body,
            subject: mail.subject
          };
          smtp.sendAnEmail(newMail)
            .then(() => {
              mail.updateAttributes({treated: true});
            })
            .catch( err => {
              throw err;
            });
        });
      }
  });
};

exports.getDateOfLastMailWithContactId = function(contactId) {
    console.log(contactId);
    return Mail.max('date', { where: {recipient: contactId}});
};
