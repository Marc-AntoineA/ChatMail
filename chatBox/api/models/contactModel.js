'use strict';

var Sequelize = require('sequelize');
var database = require('../../settings').database;

var Contact = database.define('chat_contacts', {
  address: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  forename: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

exports.Contact = Contact;
