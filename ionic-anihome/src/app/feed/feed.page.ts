import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  posts = []
  noPostsFound: boolean = false


  constructor(private afs: AngularFirestore) { }

  ngOnInit() {

    this.getAllPosts()

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
          if (doc.data().characterName.toUpperCase().includes(caps)) {
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

  getAllPosts() {
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

}
