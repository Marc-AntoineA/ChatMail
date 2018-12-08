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

  }

  openConversation(contact){
    this.sessionData.setCurrentContact(contact);
  }

  refreshMails() {
    this.sessionData.refreshMails();
  }

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
