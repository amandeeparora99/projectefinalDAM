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
  fullname: string
  profilePic: string
  isAdmin: boolean
  postCount: string = "0"
  totalLikes: string = "0"

  constructor(private afs: AngularFirestore, private user: UserService, private router: Router) { 
    this.mainuser = afs.doc(`users/${this.user.getUID()}`)
    console.log("HA ENTRAT A PROFILE EL USER: "+this.mainuser)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.username = event.username
      this.profilePic = event.profilePic
      this.isAdmin = event.isAdmin
      this.fullname = event.fullname
      if(event.posts){
        this.postCount = event.posts.length
      }
      console.log("USERNAME DEL USER: "+event.username)
      console.log("ES ADMIN?: "+event.isAdmin)
      console.log(event.posts)
      console.log(event.posts[0])
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
