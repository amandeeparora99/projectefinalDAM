import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  //User posts es el document amb tots els pjs que ha penjat un usuari
  mainuser: AngularFirestoreDocument
  userPosts
  sub
  posts
  username: string
  profilePic: string
  
  constructor(private afs: AngularFirestore, private user: UserService, private router: Router) { 
    const mainuser = afs.doc(`users/${this.user.getUID()}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.username = event.username
      this.profilePic = event.profilePic
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  goTo(postID: string) {
    console.log("POST ID ABANS DE SER ENVIAT A TABS: "+postID)
    this.router.navigate(['/tabs/post/'+ postID])
  }

  ngOnInit() {
  }

}
