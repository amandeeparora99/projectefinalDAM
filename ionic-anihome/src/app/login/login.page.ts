import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = ""
  password: string = ""

  constructor(public afAuth: AngularFireAuth, public user: UserService, public router: Router) { }
  
  ngOnInit() {
  }

  async login() {
    const { username, password } = this
    try {
      // Kind of a hack
      const res = await this.afAuth.signInWithEmailAndPassword(username, password);
    
      if(res.user) {
        this.user.setUser({
          username,
          uid: res.user.uid
        })

        //Autentificat. Redirigeix a la homepage
        this.router.navigate(['/tabs'])
      }
    
    } catch (err) {
      console.dir(err)
      if(err.code === "auth/user-not-found"){
        console.log("USER NOT FOUND!")
      }
    }
  }

  redirectRegister() {
    this.router.navigate(['/register'])
  }
  
}
