import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';


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
  segmentValue: string = 'accepted'

  acceptedPosts = []
  pendingPosts = []
  deniedPosts = []

  postReference
  likeCounter: number = 0

  constructor(
    private afs: AngularFirestore,
    private user: UserService,
    private router: Router,
    private menu: MenuController
  ) {

  }



  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  goTo(postID: string) {
    console.log("POST ID ABANS DE SER ENVIAT A TABS: " + postID)
    this.router.navigate(['/tabs/post/' + postID])
  }

  ngOnInit() {
    console.log("Profile page started")
  }

  obrirMenu() {

    this.menu.enable(true, 'sidebar');
    this.menu.open('sidebar');
    console.log("clicat el obrir menu")

  }

  startFunction() {
    this.mainuser = this.afs.doc(`users/${this.user.getUID()}`)
    console.log("HA ENTRAT A PROFILE EL USER: " + this.mainuser)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.username = event.username
      this.profilePic = event.profilePic
      this.isAdmin = event.isAdmin
      this.fullname = event.fullname
      if (event.posts) {
        this.postCount = event.posts.length
        this.posts.forEach(post => {
          this.acceptedPosts = []
          this.pendingPosts = []
          this.deniedPosts = []
          this.likeCounter = 0
          this.checkTotalLikes(post.image)
          this.assignPostStatus(post.image)
        });
      }
      console.log("USERNAME DEL USER: " + event.username)
      console.log("ES ADMIN?: " + event.isAdmin)
      console.log(this.acceptedPosts)
      console.log(this.pendingPosts)
      console.log(this.deniedPosts)
    })
  }

  ionViewWillEnter() {
    this.startFunction()
  }

  // getPostStatus(GivenPostId: string){
  //   console.log("YES")
  //   this.postReference = this.afs.doc(`posts/${GivenPostId}`)
  //   this.sub = this.postReference.valueChanges().subscribe(val => {
  //     this.returner = val.status
  //   })

  //   if (this.returner == 'accepted'){
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }

  checkTotalLikes(postid) {
    this.postReference = this.afs.doc(`posts/${postid}`)
    this.sub = this.postReference.valueChanges().subscribe(val => {
      this.likeCounter = this.likeCounter + val.likes.length
    })
  }

  assignPostStatus(postid) {
    this.postReference = this.afs.doc(`posts/${postid}`)
    this.sub = this.postReference.valueChanges().subscribe(val => {
      if (val.status == 'accepted') {
        this.acceptedPosts.push({
          'Data': val,
          'Id': postid
        })
      }
      else if (val.status == 'pending') {
        this.pendingPosts.push({
          'Data': val,
          'Id': postid
        })
      }
      else {
        this.deniedPosts.push({
          'Data': val,
          'Id': postid
        })
      }
    })
  }

}
