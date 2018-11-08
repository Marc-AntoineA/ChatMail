'use strict';

var Contact = require('../models/contactModel').Contact;

exports.listAllContacts = function() {
  return Contact.findAll({attributes: ['address', 'name', 'forename', 'id']});
};

exports.getContactById = function(id) {
  return Contact.find({ where: {id: id}});
};

exports.getContactByAddress = function(contactAddress) {
  return Contact.find({ where: { address: contactAddress }});
};

exports.createContact = function(contact) {
  return Contact.create(contact)
  .then(() => {
    return exports.getContactByAddress(contact.address);
  })
  .catch(err => {
    throw err;
  });
};

exports.findOrCreate = function(contact) {
  return Contact.findOrCreate({
    where: {
      address: contact.address
    },
    defaults: contact
  });
};
