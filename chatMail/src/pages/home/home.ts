import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SessionData } from "../../providers/session-data";
import { ConversationPage } from '../conversation/conversation';

import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  messengerPage: any = ConversationPage;

  constructor(public navCtrl: NavController, public sessionData: SessionData) {

      this.sessionData.getAllContacts();
      this.sessionData.getAllMails();

  }

  openConversation(contact){
    this.sessionData.setCurrentContact(contact);
  }

  refreshMails() {
    this.sessionData.refreshMails();
  }
/*
  var REFERENCE = moment("2015-06-05"); // fixed just for testing, use moment();
  var TODAY = REFERENCE.clone().startOf('day');
  var YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
  var A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');

  function isToday(momentDate) {
      return momentDate.isSame(TODAY, 'd');
  }
  function isYesterday(momentDate) {
      return momentDate.isSame(YESTERDAY, 'd');
  }
  function isWithinAWeek(momentDate) {
      return momentDate.isAfter(A_WEEK_OLD);
  }
  function isTwoWeeksOrMore(momentDate) {
      return !isWithinAWeek(momentDate);
  }*/

  isToday(date) {
    var today = moment().startOf('day');
    return today.isSame(date, 'd');
  };

  isYesterday(date) {
    var today = moment();
    var yesterday = today.clone().subtract(1, 'days');
    return yesterday.isSame(date, 'd');
  };

}
