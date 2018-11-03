'use strict';

var Contact = require('../models/contactModel').Contact;

exports.listAllContacts = function() {
  return Contact.findAll({attributes: ['adress', 'name', 'forename']});
};

exports.getContactById = function(id) {
  return Contact.find({ where: {id: id}});
};

exports.getContactByAdress = function(contactAdress) {
  return Contact.find({ where: { adress: contactAdress }});
};

exports.createContact = function(contact) {
  return Contact.create(contact)
  .then(() => {
    return getContactByAdress(contact.adress);
  })
  .catch(err => {
    throw err;
  });
};

exports.createContactOrNull = function(contact) {
  return exports.getContactByAdress(contact.adress).then(
    results => {
      if (results != null)
        return results;
      return exports.getContactByAdress(contact.adress).then(results => {
        return results;
      });
    })
    .catch(err => {
      throw err;
    });
};
