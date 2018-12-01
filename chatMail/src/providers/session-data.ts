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
  @Output() notifyModification: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient, private storage: Storage){
      this.apiUrl = "http://localhost:3000";
      this.currentContact = null;
      this.currentMail = {};
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
      let url:string;
      url = this.apiUrl + "/contacts";
      this.http.get(url)
        .subscribe( (contacts : any) => {
          this.listContacts = contacts;

          if(contacts.length > 0) this.setCurrentContact(contacts[0]);
        }, err => {
          console.log(err);
        });
    });
  }

  setCurrentContact(contact){
      this.currentContact = contact;
      this.listCurrentMails = null;
      this.resetCurrentMail();
      this.getAllCurrentMails();
  }

  resetCurrentMail() {
    this.currentMail = {body: ""};
  }

  getAllCurrentMails(){
      console.log("Téléchargement de tous les mails de " + this.currentContact.address);
      return new Promise(resolve => {
        let url: string;
        url = this.apiUrl + "/mails/" + this.currentContact.address;
        console.log(url);
        this.http.get(url)
          .subscribe((mails: any) => {
            this.listCurrentMails = mails;
            for (var mailIndex = 0; mailIndex < mails.length; mailIndex++) {
              var mail = mails[mailIndex];
              console.log(mail);
            }
            this.notifyModification.emit('downloadedAllCurrentMails');
          }, err => {
            // TODO gestion de l'erreur adéquate
        });
      });
  }

  listAllCurrentMails(){
    return this.listCurrentMails;
  }

  getAllMails(){
    console.log("Téléchargement de tous les mails disponibles sur le serveur");
    return new Promise(resolve => {
      let url: string;
      url = this.apiUrl + "/mails";
      console.log(url);
      this.http.get(url)
        .subscribe((mails: any) => {
          console.log(mails);
        }, err => {
          // TODO gestion de l'erreur adéquate
        });
    });
  }

  refreshMails() {
    console.log("Synchronisation des mails sur le serveur");
    return new Promise(resolve => {
      let url: string;
      url = this.apiUrl + "/refresh";
      console.log(url);
      this.http.get(url)
        .subscribe(() => {

        }, err => {
          // TODO
        });
    });
  }

  sendCurrentMail() {
    console.log("Sending email");
    console.log("Contact : " + this.currentContact.address);
    return new Promise(resolve => {
      let url: string;
      url = this.apiUrl + "/mails";
      this.http.post(url, { address: this.currentContact.address, body: this.currentMail.body})
        .subscribe(() => {
          this.getAllCurrentMails();
          this.resetCurrentMail();
        }, err => {

        });
    });
  }

  // TODO sauvegarde en local
  downloadAllPictures(mailId: number) {
    console.log("DownloadtAllPictures for mailId: " + mailId);
    return new Promise(resolve => {
      let url: string;
      url = this.apiUrl + "/mails/attachments/" + mailId;
      this.http.get(url)
        .subscribe((pictures: any) => {
          resolve(pictures);
        }, err => {
          // TODO gestion de l'erreur adéquate
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
