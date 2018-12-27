'use strict';

var Sequelize = require('sequelize');
var database = require('../../settings').database;
var Mail = require('./mailModel').Mail;

var Attachment = database.define("chat_attachments", {
  contentType: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.TEXT('medium'),
    allowNull: false
  },
  mail: {
    type: Sequelize.INTEGER,
    references : {
      model: Mail,
      key: 'id'
    },
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  checkSum: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

exports.getUrl = function(attachment) {
  return 'data:' + attachment.contentType + ';base64,' + attachment.data;
}

exports.Attachment = Attachment;
