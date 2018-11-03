var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adresse.de.test.785@gmail.com',
    pass: 'uneadresse'
  }
});

var mailOptions = {
  from: 'adresse.de.test.785@gmail.com',
  to: 'sptmc@posteo.eu',
  subject: 'Bonjour Marc-Antoine ! Ce petit courriel pour t\' informer de la suite à venir. Je pense réelement qu\'il serait possible de construire une application basique pour que papi puisse lire ses mails.\n Cette application fonctionnerait selon l\'architecture suivante : un serveur en node.js qui lit les mails de Papi  et les stocke dans la base de données, triés par destinataires. Tout le traitement serait fait là => le filtre anti-spam, la suppression des formats non tenus, la suppression des autres destinataires éventuels... Toutefois, les suppressions ne seront pas effectives sur le compte gmail et un rapport quotidien me sera envoyé par mail.',
  text: 'Zut, j\'ai interverti l\objet et le corps du mail... Bref, le serveur en node js fournirait alors une api reste pour l\envoi de mails avec les fonctionnalités suivantes = envoyer ce mail à ...  avec ces photos + actualiser la boîte mail + recevoir la liste de tous les mails d\'une personne. Au niveau du back, on aurait une base de données contenant tous les mails et leur expéditeur + les éventuelles pièces jointes.'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
