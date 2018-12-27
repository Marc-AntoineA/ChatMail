'use strict';
// Contient les fonctions pour parser et envoyer les mails non lus dans la
// base de données.
// Cela se fait dès qu'un nouveau mail à envoyer et non envoyé
// est mis dans la base de données

var smtp = require('../../settings').smtp;

exports.sendAnEmail = function(mail) {
  return smtp.sendMail(mail);
};
