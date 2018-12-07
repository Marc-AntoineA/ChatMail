import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

const cameraPreviewOpts: CameraPreviewOptions = {
  x: 0,
  y: 0,
  width: window.screen.width,
  height: window.screen.height,
  camera: 'rear',
  tapPhoto: true,
  previewDrag: true,
  toBack: true,
  alpha: 1
};

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  picture: string;
  backCamera: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private cameraPreview: CameraPreview, public menu : MenuController){

    this.backCamera = true;


  }


  takePicture(){
    console.log("Photo prise...");
    this.navCtrl.pop();
  }

  reverseCamera(){
    console.log("Changement de l'appareil photo");

  }

  ionViewDidLoad(){
      this.menu.enable(false);
      // start camera
      this.cameraPreview.startCamera(
        {
          x: 0,
          y: 0,
          width: window.screen.width,
          height: window.screen.height,
          toBack: true,
          previewDrag: false,
          tapPhoto: true});
      this.cameraPreview.show();
  }

  ionViewWillLeave(){
    this.cameraPreview.stopCamera();
    this.menu.enable(true);
  }

}
