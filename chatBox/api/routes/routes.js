'use strict';

module.exports = function(app) {
  var chatApi = require('../controllers/controller');

  app.route('/contacts')
    .get(chatApi.listAllContacts)
    .post(chatApi.createContact);

  app.route('/mails')
    .get(chatApi.listAllMails)
    .post(chatApi.sendAnEmail);

  app.route('/mails/:address')
    .get(chatApi.listAllMailsByContact)
    .post(chatApi.sendAMailByContact);

  app.route('/mails/date/:date')
    .get(chatApi.listNewEmails);

  app.route('/mails/date/:date/:address')
    .get(chatApi.listNewMailsByContact);

  app.route('/refresh')
    .get(chatApi.refreshMails);
}
