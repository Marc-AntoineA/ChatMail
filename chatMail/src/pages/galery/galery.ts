import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content, MenuController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraPage } from '../../pages/camera/camera';

import { SessionData } from '../../providers/session-data';


@IonicPage()
@Component({
  selector: 'page-galery',
  templateUrl: 'galery.html',
  queries: {
   content: new ViewChild('content')
  }
})
export class GaleryPage {
  pictures: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public sessionData: SessionData, private alertCtrl: AlertController, public menu : MenuController,
      private _DomSanitizationService: DomSanitizer) {

      this.pictures = [];
  }

  ionViewDidLoad(){
      var mailId = this.navParams.get('id');
      if (mailId == undefined)
        this.navCtrl.pop();

      this.sessionData.getAllPictures(mailId).then((results) => {
        this.pictures = results;
      });
      this.menu.enable(false);
  }

  ionViewWillLeave(){
    this.menu.enable(true);
  }

}
