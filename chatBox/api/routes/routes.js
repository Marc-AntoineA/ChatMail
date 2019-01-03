'use strict';

module.exports = function(app) {
  var chatApi = require('../controllers/controller');

  app.route('/contacts')
    .get(chatApi.listAllContacts)
    .post(chatApi.createContact);

  app.route('mails/')
    .post(chatApi.sendAnEmail);

  app.route('/mails/:address')
    .get(chatApi.listLastsMailsByContact);

  app.route('/mails/date/:date')
    .get(chatApi.listNewEmails);

  app.route('/mails/date/:date/:address')
    .get(chatApi.listNewMailsByContact);

  app.route('/mails/attachments/:mail')
    .get(chatApi.getAttachmentsByMail);

  app.route('/refresh')
    .get(chatApi.refreshMails);

  app.route('/test-attachments')
    .post(chatApi.testAttachment);
}
