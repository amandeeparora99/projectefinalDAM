import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { pipe } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from "firebase/app";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string
  characterName: string = ""
  characterDesc: string = ""
  cabells: string = 'curt'
  cabellsColor: string = 'negre'
  noTeCabells: boolean
  ulls: string = 'normals'
  ullsColor: string = 'negre'
  noTeUlls: boolean
  animeName: string = ""

  characterSexe: string = 'masculi'
  characterAge: string = 'nen'
  characterType: string = 'huma'

  mangaCheckbox: boolean = true
  animeCheckbox: boolean = false
  movieCheckbox: boolean = false

  status: string = 'pending'
  busy: boolean = false

  @ViewChild('fileButton', { static: false }) fileButton

  constructor(
    public http: HttpClient,
    public afstore: AngularFirestore,
    public user: UserService,
    private alertController: AlertController,
    private router: Router
  ) {

  }

  ngOnInit() {
  }

  async createPost() {
    this.busy = true

    const image = this.imageURL
    const characterName = this.characterName
    const characterDesc = this.characterDesc
    const animeName = this.animeName.toUpperCase()
    const characterSexe = this.characterSexe
    const characterAge = this.characterAge
    const characterType = this.characterType
    const mangaCheckbox = this.mangaCheckbox
    const animeCheckbox = this.animeCheckbox
    const movieCheckbox = this.movieCheckbox
    const characterHair = this.cabells
    const characterHairColor = this.cabellsColor
    const characterEyes = this.ulls
    const characterEyesColor = this.ullsColor
    const status = 'pending'

    // TESTING
    // console.log(image)
    // console.log(characterName)
    // console.log(characterDesc)
    // console.log(animeName)
    // console.log(characterSexe)
    // console.log(characterAge)
    // console.log(characterType)
    // console.log(mangaCheckbox)
    // console.log(animeCheckbox)
    // console.log(movieCheckbox)
    // console.log(characterHair)
    // console.log(characterHairColor)
    // console.log(characterEyes)
    // console.log(characterEyesColor)

    //DOCUMENT DE USERS, GUARDAR POST DE CADA USER
    this.afstore.doc(`users/${this.user.getUID()}`)
      .update({
        posts: firestore.FieldValue.arrayUnion({
          image,
          characterName,
          characterDesc,
          animeName,
          characterSexe,
          characterAge,
          characterType,
          mangaCheckbox,
          animeCheckbox,
          movieCheckbox,
          characterHair,
          characterHairColor,
          characterEyes,
          characterEyesColor
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
              characterName,
              characterDesc,
              animeName,
              characterSexe,
              characterAge,
              characterType,
              mangaCheckbox,
              animeCheckbox,
              movieCheckbox,
              characterHair,
              characterHairColor,
              characterEyes,
              characterEyesColor
            })
          });
      });

    //DOCUMENT DE POSTS, CONJUNT DE TOTS ELS POSTS
    this.afstore.doc(`posts/${image}`).set({
      characterName,
      characterDesc,
      animeName,
      characterSexe,
      characterAge,
      characterType,
      mangaCheckbox,
      animeCheckbox,
      movieCheckbox,
      characterHair,
      characterHairColor,
      characterEyes,
      characterEyesColor,
      author: this.user.getUsername(),
      status,
      likes: []
      
    })

    console.log("Post enviat correctament")

    this.busy = false
    this.imageURL = ""
    this.characterName = ""



    const alert = await this.alertController.create({
      header: 'Fet',
      message: "El teu personatge s'ha enviat!",
      buttons: ['Guai!']
    })

    await alert.present()

    this.router.navigate(['/tabs/feed'])

  }

  fileChanged(event) {

    this.busy = true

    const files = event.target.files
    console.log(files)

    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE', '1')
    data.append('UPLOADCARE_PUB_KEY', '99e734accdd2b90d4d81')

    this.http.post<any>('https://upload.uploadcare.com/base/', data)
      .subscribe(event => {
        console.log(event.file)
        this.imageURL = event.file
        this.busy = false
    })

  }

  uploadFile() {
    this.fileButton.nativeElement.click()
  }

  ionChangeCabells() {
    if (this.cabells == 'sense') {
      if (this.cabellsColor != 'sense') {
        this.cabellsColor = 'sense'
      }
      console.log("S'han desactivat els colors de cabell ja que no té cabells")
      this.noTeCabells = true
    }
    else {
      this.noTeCabells = false
    }
  }

  ionChangeUlls() {
    if (this.ulls == 'no-visibles') {
      if (this.ullsColor != 'no-visibles') {
        this.ullsColor = 'no-visibles'
      }
      console.log("S'han desactivat els colors d'ulls ja que no té ulls")
      this.noTeUlls = true
    }
    else {
      this.noTeUlls = false
    }
  }

  validateForm(){
    if (this.characterName == ""){
      this.presentAlert("Has d'introduir un nom pel personatge!")
    }
    else if(this.characterDesc == ""){
      this.presentAlert("Has d'introduir una breu descripció!")
    }
    else if (this.animeName == "") {
      this.presentAlert("Has de dir a quin anime pertany!")
    }
    else if(!this.animeCheckbox && !this.mangaCheckbox && !this.movieCheckbox){
      this.presentAlert("El personatge ha hagut d'aparèixer en un ANIME, MANGA o PEL·LÍCULA!")
    }
    else{
      this.createPost()
    }
  }

  async presentAlert(messageInput: string) {
    const alert = await this.alertController.create({
      header: 'AniHome ERROR',
      message: messageInput,
      buttons: ['OK']
    });

    await alert.present();
  }
}

