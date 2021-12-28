import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraPage } from '../../pages/camera/camera';
import { GaleryPage } from '../../pages/galery/galery';

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

  trim(str: string) {
    //console.log(str);
    str = str.replace("\t", "&nbsp&nbsp&nbsp&nbsp")
    str = str.replace(/\n/g, "<br/>")
    while (str.includes("<br/><br/>")) {
      str = str.replace(/<br\/> <br\/>/g, "<br/>");
      str = str.replace(/<br\/><br\/>/g, "<br/>");
    }
    str = str.replace(/&nbsp;<br>/g,"")
    //console.log(str.trim());
    return str.trim();
  }

  sendMail(){
    let alert = this.alertCtrl.create({
      title: 'Envoi du courrier',
      message: 'Êtes-vous sûr de vouloir envoyer ce courier électronique maintenant ?',
      cssClass: 'validation-alert',
      buttons: [
        {
          text: 'Non, plus tard',
          role: 'cancel',
          cssClass: 'red validation-button left',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          cssClass: 'green validation-button right',
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
    this.sessionData.saveCurrentMail();
  }

  openGalery(message: any) {
    if (message.id != undefined)
      this.navCtrl.push(GaleryPage, {'id': message.id});
    else
      console.log("Error with open galery");
  }
}
