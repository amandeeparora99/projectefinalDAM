import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { pipe } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from "firebase/app";

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string
  characterName: string

  constructor(
    public http: HttpClient,
    public afstore: AngularFirestore,
    public user: UserService
    ) { 
    
  }

  ngOnInit() {
  }

  createPost(){
    const image = this.imageURL
    const characterName = this.characterName

    //DOCUMENT DE USERS, GUARDAR POST DE CADA USER
    this.afstore.doc(`users/${this.user.getUID()}`)
      .update({
          posts: firestore.FieldValue.arrayUnion({
          image,
          characterName
        })
      })
      .then(() => {
        // update successful (document exists)
      })
      .catch((error) => {
        // console.log('Error updating user', error); // (document does not exists)
        this.afstore.doc(`users/${this.user.getUID()}`)
          .set({
            posts: firestore.FieldValue.arrayUnion({
              image,
              characterName
            })
          });
      });

      //DOCUMENT DE POSTS, CONJUNT DE TOTS ELS POSTS
      this.afstore.doc(`posts/${image}`).set({
        characterName,
        author: this.user.getUsername(),
      })

    console.log("POST ENVIAT CORRECTAMENT")

  }

  fileChanged(event) {
    const files = event.target.files
    console.log(files)

    const data = new FormData()
    data.append('file',files[0])
    data.append('UPLOADCARE_STORE', '1')
    data.append('UPLOADCARE_PUB_KEY', '1ad55f3c8983ea0341bb')

    this.http.post<any>('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
      
      console.log(event.file)
      this.imageURL = event.file
    })
    }

  }
 
