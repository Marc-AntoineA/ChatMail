'use strict';

var quotedPrintable = require('quoted-printable');
// https://github.com/mathiasbynens/quoted-printable

var utf8 = require('utf8');

exports.fromQp = function(string) {
  try {
    return utf8.decode(quotedPrintable.decode(string));
  } catch(err) {
    console.log(err); // TODO manager les erreurs
    return quotedPrintable.decode(string);
  }

}
