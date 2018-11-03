import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';


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

    let options = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: this.backCamera ? cameraPreview.CAMERA_DIRECTION.BACK : cameraPreview.CAMERA_DIRECTION.FRONT,
      toBack: true,
      tapPhoto: true,
      previewDrag: false,
      tapFocus: false,
    };


    cameraPreview.startCamera(options);
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
  }
  
  ionViewWillLeave(){
    this.menu.enable(true);
  }

}
