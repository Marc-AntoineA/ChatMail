'use strict';

var quotedPrintable = require('quoted-printable');
// https://github.com/mathiasbynens/quoted-printable

var utf8 = require('utf8');

exports.fromQp = function(string) {
  return utf8.decode(quotedPrintable.decode(string));
}
