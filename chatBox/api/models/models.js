var Sequelize = require('sequelize');

var database = require('../../settings').database;

var Contact = database.define('chat_contacts', {
  adress: Sequelize.STRING,
  name: Sequelize.STRING,
  forename: Sequelize.STRING
});


var Mail = database.define('chat_mail', {
  recipient: {
    type: Sequelize.INTEGER,
    references: {
      model: Contact,
      key: 'id'
    }
  },
  subject: Sequelize.STRING,
  body: Sequelize.STRING,
  toMe: Sequelize.BOOLEAN,  // true ssi le message nous a été envoyé
  treated: Sequelize.BOOLEAN,
  date: Sequelize.DATE,
});

// TODO
var Attachment = database.define("chat_attachments", {

});

exports.Mail = Mail;
exports.Contact = Contact;
exports.Attachment = Attachment;
