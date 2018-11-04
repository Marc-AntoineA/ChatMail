import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SessionData } from "../../providers/session-data";
import { ConversationPage } from '../conversation/conversation';

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
}
