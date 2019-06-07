import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { SessionData } from "../../providers/session-data";
import { ConversationPage } from '../conversation/conversation';

import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  messengerPage: any = ConversationPage
  constructor(public navCtrl: NavController, public sessionData: SessionData,
     public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.refreshMails();
  }

  showErrorMessage(internetWorks: boolean) {
    const message = internetWorks ?
      'Veuillez informer le gestionnaire de l\'application de cette erreur.'
      : 'L\'appareil ne semble pas avoir accès à internet, veuillez réessayer ultérieurement';

    const alert = this.alertCtrl.create({
      title: 'Oups, quelque chose semble cassé',
      message: message,
      cssClass: 'validation-alert',
      buttons: [
        {
          text: 'Réessayer',
          cssClass: 'green validation-button center',
          handler: () => {
            this.refreshMails();
          }
        }
      ]
    });
    alert.present();
  }

  openConversation(contact){
    this.sessionData.setCurrentContact(contact);
  }

  refreshMails() {
    const loader = this.loadingCtrl.create({
     content: "Chargement en cours..."
    });
    loader.present();

    this.sessionData.refreshMails()
      .then(() => {
        loader.dismiss();
      })
      .catch((error) => {
        this.sessionData.testInternetConnection()
          .then(() => {
            loader.dismiss();
            this.showErrorMessage(true);
          })
          .catch(() => {
            loader.dismiss();
            this.showErrorMessage(false)
          });
      });
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
