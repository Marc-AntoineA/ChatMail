import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

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
  currentPictureIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public sessionData: SessionData, public menu : MenuController) {

      this.pictures = [];
      this.currentPictureIndex = -1;
  }

  ionViewDidLoad(){
      var mailId = this.navParams.get('id');
      if (mailId == undefined)
        this.navCtrl.pop();

      this.sessionData.getAllPictures(mailId).then((results) => {
        this.pictures = results;
        this.currentPictureIndex = 0;
      });
      this.menu.enable(false);
  }

  changePicture(index: number) {
    this.currentPictureIndex = index;
    console.log(this.currentPictureIndex);
  }

  ionViewWillLeave(){
    this.menu.enable(true);
  }

  quitGalery() {
    this.navCtrl.pop();
  }
}
