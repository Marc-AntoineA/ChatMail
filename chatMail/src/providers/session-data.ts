import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class SessionData {
  token: string;
  apiUrl: string;
  listContacts: any;
  listCurrentMails: any;
  currentContact: any;

  constructor(public http: HttpClient){
      this.apiUrl = "http://localhost:3000";
      this.currentContact = null;
  }

  // TODO faire les choses proprement avec la requête au besoin
  listAllContacts(){
    return this.listContacts;
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
      this.getAllCurrentMails();
  }

  getAllCurrentMails(){
      console.log("Téléchargement de tous les mails de " + this.currentContact.adress);

      return new Promise(resolve => {
        let url: string;
        url = this.apiUrl + "/mails/" + this.currentContact.adress;
        console.log(url);
        this.http.get(url)
          .subscribe((mails: any) => {
            this.listCurrentMails = mails;
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
}
