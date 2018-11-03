
var Sequelize = require('sequelize');
var database = require('../../settings').database;
var models = require('./models');

database.sync().then(function() {
  return models.Contact.create({
    adress: 'marc-antoine.auge@poseo.net',
    name: 'Augé',
    vorname: 'Marc-Antoine'
  });
}).then(function(contact) {
  return models.Mail.create({
    recipient: contact.id,
    sent: true,
    subject: 'Salut Marc-Antoine',
    body: 'Ce premier mail pour toi',
    toMe: true,
    treated: false
  });
  console.log(jane.get({plain: true}));
});
