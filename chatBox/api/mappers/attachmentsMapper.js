'use strict';

var Attachment = require('../models/attachmentModel').Attachment;
var Sequelize = require('sequelize');

const Op = Sequelize.Op;

// TODO find or create
exports.addAttachmentWithMailId = function(mailId, attachment) {
    attachment.mail = mailId;
    return Attachment.create(attachment);
};

// TODO update la liste des formats gérés
exports.listAttachmentsByMailId = function (mailId) {
  return Attachment.findAll({where: {
    mail: mailId,
    contentType: {
      [Op.in]: ['image/png']
    }
  }});
};
