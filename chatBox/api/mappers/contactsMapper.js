'use strict';

var Contact = require('../models/contactModel').Contact;

exports.listAllContacts = function() {
  return Contact.findAll({attributes: ['address', 'name', 'forename']});
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

exports.createContactOrNull = function(contact) {
  return exports.getContactByAddress(contact.address).then(
    results => {
      if (results != null)
        return results;
      console.log(contact);
      exports.createContact(contact).then(results => {
        console.log(results);
        return results;
      });
    })
    .catch(err => {
      throw err;
    });
};
