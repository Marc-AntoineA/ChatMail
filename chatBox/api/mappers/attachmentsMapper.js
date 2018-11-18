'use strict';

var Attachment = require('../models/attachmentModel').Attachment;

// TODO 

exports.addAttachmentWithMailId = function(mailId, attachment) {
    attachment.mail = mailId;
    console.log(attachment);
    return Attachment.create(attachment);
};

/*exports.createContact = function(contact) {
  return Contact.create(contact)
  .then(() => {
    return exports.getContactByAddress(contact.address);
  })
  .catch(err => {
    throw err;
  });
};*/

exports.listAttachmentsByMailId = function (mailId) {

};
