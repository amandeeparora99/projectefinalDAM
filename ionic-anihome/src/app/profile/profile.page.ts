import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  //User posts es el document amb tots els pjs que ha penjat un usuari
  userPosts
  
  constructor(private afs: AngularFirestore, private user: UserService) { 
    const posts = afs.doc(`users/${this.user.getUID()}`)
    this.userPosts = posts.valueChanges()
  }

  ngOnInit() {
  }

}
