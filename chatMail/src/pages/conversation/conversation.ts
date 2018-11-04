import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraPage } from '../../pages/camera/camera';

import { SessionData } from '../../providers/session-data';


@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  currentMail: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public sessionData: SessionData, private alertCtrl: AlertController) {

      this.currentMail = {};
      this.currentMail.body = "Ce court mail préenregistré imite le comportement voulu des messages des messages de brouillon. Un message non achevé se trouve toujours ici (si tant-est qu'on regarde pour la bonne personne, bien entendu !).\
      Voilà, voilà, tout est écrit.";
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
        handler: () => {
          console.log("Envoi du mail à effectuer ici");
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
