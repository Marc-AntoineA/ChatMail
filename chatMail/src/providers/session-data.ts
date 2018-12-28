import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';


@Injectable()
export class SessionData {
  token: string;
  apiUrl: string;
  listContacts: any;
  listCurrentMails: any;
  currentContact: any;
  currentMail: any;
  getOptions: any;

  @Output() notifyModification: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient, private storage: Storage){

      this.currentContact = null;
      this.token = null;
      this.apiUrl = null;

      this.currentMail = {};
      this.getSettings();
  }

  getSettings() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/settings.json').toPromise().then((res: any) => {
        this.token = res.token;
        this.apiUrl = res.apiUrl
        this.getOptions = { headers: { 'Authorization': 'Token ' + this.token } };
        console.log("resolve");
        resolve();
      });
    });
  }

  // TODO faire les choses proprement avec la requête au besoin
  listAllContacts(){
    return this.listContacts;
  }

  getDateOfLastMail() {
    if (this.listCurrentMails == null) return null;
    return this.listCurrentMails[this.listCurrentMails.length - 1].date;
  }

  getAllContacts(){
    console.log("Téléchargement de tous les contacts disponibles sur le serveur");
    return new Promise(resolve => {
      this.getSettings().then(() => {
        let url: string;
        url = this.apiUrl + "/contacts";
        this.http.get(url, this.getOptions).subscribe( (contacts: any) => {
            this.listContacts = contacts;
            this.listContacts = this.listContacts.sort((a, b) => a.date <= b.date);
            if(contacts.length > 0) this.setCurrentContact(contacts[0]);
          }, err => {
            console.log(err);
          });
        });
      });
  }

  setCurrentContact(contact){
      this.saveCurrentMail().then(() => {
        this.currentContact = contact;
        this.listCurrentMails = null;
        this.loadCurrentMail();
        this.getAllCurrentMails();
      });
  }

  loadCurrentMail() {
    console.log("resetCurrentMail for contact : " + this.currentContact.address);
    let key = 'currentMail-' + this.currentContact.address;
    this.storage.get(key).then((val) =>{
      if (val != undefined){
          this.currentMail = val;
      } else {
        this.resetCurrentMail();
      }
    });
  }

  resetCurrentMail() {
    this.currentMail = {body: "", picture: ""};
  }

  saveCurrentMail() {
    return new Promise(resolve => {
        if (this.currentMail == null) resolve();
        if (this.currentContact == null) resolve();
        let key = 'currentMail-' + this.currentContact.address;
        this.storage.set(key, this.currentMail);
        resolve();
      });
  }

  getAllCurrentMails(){
      console.log("Téléchargement de tous les mails de " + this.currentContact.address);
      return new Promise(resolve => {
        let url: string;
        this.getSettings().then(() => {
          url = this.apiUrl + "/mails/" + this.currentContact.address;
          this.http.get(url, this.getOptions).subscribe((mails: any) => {
              this.listCurrentMails = mails;
              this.notifyModification.emit('downloadedAllCurrentMails');
            }, err => {
              // TODO gestion de l'erreur adéquate
          });
        });
      });
  }

  listAllCurrentMails(){
    return this.listCurrentMails;
  }

  refreshMails() {
    console.log("Synchronisation des mails sur le serveur");
    return new Promise(resolve => {
      this.getSettings().then(() => {
        let url: string;
        url = this.apiUrl + "/refresh";
        console.log(url);
        this.http.get(url, this.getOptions).subscribe(() => {
            this.getAllCurrentMails();
            this.notifyModification.emit('downloadedAllCurrentMails');
            this.getAllContacts();
          }, err => {
            // TODO
          });
        });
    });
  }

  // TODO contentType = jpeg ou png?
  sendCurrentMail() {
    console.log("Sending email");
    console.log("Contact : " + this.currentContact.address);
    return new Promise(resolve => {
      this.getSettings().then(() => {
        let url: string;
        url = this.apiUrl + "/mails";
        let mail = {
          address: this.currentContact.address,
          body: this.currentMail.body,
          attachment: undefined
        };
        if (this.currentMail.picture != undefined && this.currentMail.picture != "")
          mail.attachment = {
            contentType: 'image/jpeg',
            data: this.currentMail.picture,
            fileName: 'chatBoxPhoto.jpg'
          }
        this.http.post(url, mail, this.getOptions)
          .subscribe(() => {
            this.getAllCurrentMails();
            this.resetCurrentMail();
          }, err => {

          });
        });
    });
  }

  // TODO sauvegarde en local
  downloadAllPictures(mailId: number) {
    console.log("DownloadtAllPictures for mailId: " + mailId);
    return new Promise(resolve => {
      this.getSettings().then(() => {
        let url: string;
        url = this.apiUrl + "/mails/attachments/" + mailId;
        this.http.get(url, this.getOptions).subscribe((pictures: any) => {
            resolve(pictures);
          }, err => {
            // TODO gestion de l'erreur adéquate
          });
        });
    });
  }

  getAllPictures(mailId: number) {
    return new Promise(resolve => {
      let key = 'attachments-' + mailId;
      this.storage.get(key).then((val) =>{
        if (val != undefined){
          resolve(val);
        } else {
          this.downloadAllPictures(mailId).then((val) => {
            this.storage.set(key, val);
            resolve(val);
          });
        }
      });
    });
  }

}
