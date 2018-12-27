'use strict';

var Attachment = require('../models/attachmentModel').Attachment;
var Sequelize = require('sequelize');
var logger = require('../../logger').logger;

const Op = Sequelize.Op;

// TODO find or create
exports.addAttachmentWithMailId = function(mailId, attachment) {
    attachment.mail = mailId;
    if (attachment.contentType != 'image/png' || 'image/jpeg')
      logger.log({
        level: 'warn',
        message: 'Une nouvelle pièce jointe de type ' + attachment.contentType + '(non géré) vient d\'être ajoutée'
      });
    return Attachment.create(attachment);
};

// TODO update la liste des formats gérés
exports.listAttachmentsByMailId = function (mailId) {
  return Attachment.findAll({where: {
    mail: mailId,
    contentType: {
      [Op.in]: ['image/png', 'image/jpeg']
    }
  }});
};
