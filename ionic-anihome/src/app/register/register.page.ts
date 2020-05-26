import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase/app'

import { AlertController } from '@ionic/angular'
import { Router } from '@angular/router';
import { AngularFirestore } from "@angular/fire/firestore";
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = ""
  password: string = ""
  cpassword: string = ""
  fullname: string

  constructor(
    public afAuth: AngularFireAuth,
    public afstore: AngularFirestore,
    public user: UserService,
    public alert: AlertController,
    public router: Router,
    
    ) { }

  ngOnInit() {
  }

  async register() {
    const { username, password, cpassword, fullname } = this
    if(password !== cpassword){
      this.showAlert("Error!", "Les contrasenyes no coincideixen")
      return console.error("Passwords don't match!")
    }
    else if(fullname == ''){
      this.showAlert("Error!", "Emplena tots els camps!")
      return console.error("Invalid username!")
    }

    try {
      const res = await this.afAuth.createUserWithEmailAndPassword(username, password);
      
      //Aqui el que fem es crear un document a /users/ i li posem el valor de username

      this.afstore.doc(`users/${res.user.uid}`).set({
        username,
        isAdmin: '',
        profilePic: '0abaadc4-f346-4c29-841b-f5de4493f35c',
        fullname
      })

      this.user.setUser({
        username,
        uid: res.user.uid,
      })
      
      this.showAlert("Èxit!", "T'has registrat correctament!")
      this.router.navigate(['/tabs'])

    } catch (error) {
      console.dir(error)
      this.showAlert("Error!", error.message)

    }
    

  }
  async showAlert(header:string , message:string){
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })

    await (await alert).present();

  }

  redirectLogin(){
    this.router.navigate(['/login'])
  }

}
