import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  posts = []
  noPostsFound: boolean = false
  mainuser
  sub
  sub2
  isAdmin: string = ''

  // animeName: string = ""


  constructor(private afs: AngularFirestore, private user: UserService, private router: Router, private route: ActivatedRoute) {
    
    // this.route.queryParams.subscribe(params => {
    //   if (params && params.special != '') {
    //     this.animeName = params.special
    //     this.getAllPostsByAnimeName(params.special)
    //     this.animeName = ''
    //     params.special = ''
    //   }
    //   else {
    //     this.getAllPosts()
    //   }
    // })
   }

  ngOnInit() {
    console.log("Feed page entered")
  }

  ionViewWillEnter() {
    this.mainuser = this.afs.doc(`users/${this.user.getUID()}`)
    console.log("HA ENTRAT A FEED EL USER: "+this.mainuser)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.isAdmin = event.isAdmin
      this.posts = []
      if(event.isAdmin == ''){
        console.log("Mostrant posts accepted perque no es admin")
        this.getAllPostsNotAdmin()
      }
      else{
        console.log("Mostrant all posts accepted perque ES admin")
        this.getAllPosts()
      }
    })
    
  }

  onSearchChange(event) {
    let searchKey: string = event.target.value;
    let caps = searchKey.toUpperCase();

    if (searchKey.length == 0) {
      this.posts = []
      this.noPostsFound = false
      this.getAllPosts()
    }
    else {
      this.posts = []
      this.afs.collection('posts').get().toPromise().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          if (doc.data().characterName.toUpperCase().includes(caps) || doc.data().animeName.toUpperCase().includes(caps)) {
            this.posts.push({
              'Data': doc.data(),
              'Id': doc.id
            })
          }
        });
        if(this.posts.length == 0){
          this.noPostsFound = true
        }
        else {
          this.noPostsFound = false
        }
      })
    }
  }

  // getAllPostsByAnimeName(aniname) {
  //   let caps = aniname.toUpperCase();

  //   this.posts = []
  //   this.afs.collection('posts').get().toPromise().then((snapshot) => {
  //     snapshot.docs.forEach(doc => {
  //       if (doc.data().animeName.toUpperCase().includes(caps)) {
  //         this.posts.push({
  //           'Data': doc.data(),
  //           'Id': doc.id
  //         })
  //       }
  //     });
  //     if(this.posts.length == 0){
  //       this.noPostsFound = true
  //     }
  //     else {
  //       this.noPostsFound = false
  //     }
  //   })
  // }

  getAllPosts() {
    //AQUI CARREGAR NOMES ELS ACCEPTED
    this.afs.collection('posts').get().toPromise().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        this.posts.push({
          'Data': doc.data(),
          'Id': doc.id
        })
      });
      console.log("AQUI TENIM L'ARRAY DE POSTS:")
      console.log(this.posts)
    })
  }

  getAllPostsNotAdmin() {
    //AQUI CARREGAR NOMES ELS ACCEPTED
    this.afs.collection('posts').get().toPromise().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        if(doc.data().status == 'accepted'){
          this.posts.push({
            'Data': doc.data(),
            'Id': doc.id
          })
        }
      });
      console.log("AQUI TENIM L'ARRAY DE POSTS:")
      console.log(this.posts)
    })
  }

  goTo(postID: string) {
    console.log("POST ID ABANS DE SER ENVIAT A TABS: "+postID)
    this.router.navigate(['/tabs/post/'+ postID])
  }

  statusColor(status: string){
    if (status == "pending") {
      return "warning"
    }
    else if(status == "accepted") {
      return "success"
    }
    else{
      return "danger"
    }
  }
}
