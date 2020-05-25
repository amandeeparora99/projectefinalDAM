import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from "firebase/app";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})

export class PostPage implements OnInit {

  postID: string
  post
  postReference: AngularFirestoreDocument
  sub

  heartType: string = "heart-outline"
  
  constructor(
    private route: ActivatedRoute, 
    private afs: AngularFirestore,
    private user: UserService,
    private alertController: AlertController) { 
    
  }

  ngOnInit() {
    this.postID = this.route.snapshot.paramMap.get('id')
    this.postReference = this.afs.doc(`posts/${this.postID}`)
    this.sub = this.postReference.valueChanges().subscribe(val => {
      this.post = val
      this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-outline'  //Comprova si l'usuari ja li havia donat like o no
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  toggleHeart() {
    //Si el cor estava buit (NO LIKE), li dona like i ho registra a Firebase amb l'id del Donador.
    //En cas contrari, s'elimina
    if(this.heartType == 'heart-outline') {
      this.postReference.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUID())
      })
      this.presentAlert("Has donat Like a aquest personatge!")
    } else {
      this.postReference.update({
        likes: firestore.FieldValue.arrayRemove(this.user.getUID())
      })
      this.presentAlert("Has eliminat el teu like!")
    }
  }

  checkTrueFalse(input: string){
    if(input == "true"){
      return true
    }
    else{
      return false
    }
  }

  async presentAlert(messageInput: string) {
    const alert = await this.alertController.create({
      header: 'AniHome Info',
      message: messageInput,
      buttons: ['OK']
    });

    await alert.present();
  }

}
