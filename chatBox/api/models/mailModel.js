'use strict';

var Sequelize = require('sequelize');
var database = require('../../settings').database;
var Contact = require('./contactModel').Contact;

var Mail = database.define('chat_mail', {
  recipient: {
    type: Sequelize.INTEGER,
    references: {
      model: Contact,
      key: 'id'
    },
    allowNull: false
  },
  subject: Sequelize.STRING,
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  toMe: {
    type: Sequelize.BOOLEAN,
    allowNull: false  // true ssi le message nous a été envoyé
  },
  treated: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

exports.Mail = Mail;
