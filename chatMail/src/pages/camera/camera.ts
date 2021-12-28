import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { CameraPreview } from '@ionic-native/camera-preview';
import { SessionData } from '../../providers/session-data';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private cameraPreview: CameraPreview, public menu : MenuController, public sessionData: SessionData){

  }

  startCamera() {
    this.cameraPreview.startCamera(
      {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        toBack: true,
        previewDrag: false,
        tapPhoto: false});
    this.cameraPreview.show();
  }

  takePicture(){
    this.cameraPreview.takePicture({quality: 30}).then((imgData) => {
        this.sessionData.currentMail.picture = imgData[0];
        this.navCtrl.pop();
      });

  }

  reverseCamera(){
    this.cameraPreview.switchCamera();
  }

  ionViewDidLoad(){
      this.menu.enable(false);
      this.startCamera();
  }

  ionViewWillLeave(){
    this.cameraPreview.stopCamera();
    this.menu.enable(true);
  }

}
