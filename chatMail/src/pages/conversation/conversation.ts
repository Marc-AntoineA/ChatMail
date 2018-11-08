import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content } from 'ionic-angular';
import { CameraPage } from '../../pages/camera/camera';

import { SessionData } from '../../providers/session-data';


@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
  queries: {
   content: new ViewChild('content')
  }
})
export class ConversationPage {
  currentMail: any;
  content: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public sessionData: SessionData, private alertCtrl: AlertController) {

      this.sessionData.notifyModification.subscribe(evt => {
        this.content.scrollToBottom();
       });
  }

  ionViewDidEnter(){
    this.scrollToLastMail();
  }

  scrollToLastMail() {
    this.content.scrollToBottom();
  }

  openCamera(){
      this.navCtrl.push(CameraPage);
  }

  sendMail(){
    let alert = this.alertCtrl.create({
    title: 'Envoi du courrier',
    message: 'Êtes-vous sûr de vouloir envoyer ce courier électronique maintenant ?',
    buttons: [
      {
        text: 'Non, plus tard',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Oui',
        cssClass: 'green',
        handler: () => {
          this.sessionData.sendCurrentMail()
            .then(() => {

            });
        }
      }
    ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }

}
