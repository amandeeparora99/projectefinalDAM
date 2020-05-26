import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
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
  sub2
  mainuser
  isAdmin: string
  status: string
  characterName: string
  characterDesc: string
  animeName: string
  characterSexe: string
  characterAge: string
  characterType: string
  mangaCheckbox: boolean
  animeCheckbox: boolean
  movieCheckbox: boolean
  characterHair: string
  characterHairColor: string
  characterEyes: string
  characterEyesColor: string

  noTeCabells: boolean = false
  noTeUlls: boolean = false

  heartType: string = "heart-outline"
  
  constructor(
    private route: ActivatedRoute, 
    private afs: AngularFirestore,
    private user: UserService,
    private alertController: AlertController,
    private router: Router) { 
      this.mainuser = afs.doc(`users/${this.user.getUID()}`)
      console.log("HA ENTRAT A POST EL USER: "+this.mainuser)
      this.sub2 = this.mainuser.valueChanges().subscribe(event => {
        this.isAdmin = event.isAdmin
      })
  }

  ngOnInit() {
    this.postID = this.route.snapshot.paramMap.get('id')
    this.postReference = this.afs.doc(`posts/${this.postID}`)
    this.sub = this.postReference.valueChanges().subscribe(val => {
      this.post = val
      this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-outline'  //Comprova si l'usuari ja li havia donat like o no
      this.characterName = val.characterName
      this.characterDesc = val.characterDesc
      this.animeName = val.animeName
      this.characterSexe = val.characterSexe
      this.characterAge = val.characterAge
      this.mangaCheckbox = val.mangaCheckbox
      this.animeCheckbox = val.animeCheckbox
      this.movieCheckbox = val.movieCheckbox
      this.characterHair = val.characterHair
      this.characterHairColor = val.characterHairColor
      this.characterEyes = val.characterEyes
      this.characterEyesColor = val.characterEyesColor
      this.characterType = val.characterType
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

  ionChangeStatus(){
    this.afs.doc(`posts/${this.postID}`).update({
      status: this.status
    })
  
    this.presentAlert("Has canviat l'status del post")
  }

  ionChangeCabells() {
    if (this.characterHair == 'sense') {
      if (this.characterHairColor != 'sense') {
        this.characterHairColor = 'sense'
      }
      console.log("S'han desactivat els colors de cabell ja que no té cabells")
      this.noTeCabells = true
    }
    else {
      this.noTeCabells = false
    }
  }

  ionChangeUlls() {
    if (this.characterEyes == 'no-visibles') {
      if (this.characterEyesColor != 'no-visibles') {
        this.characterEyesColor = 'no-visibles'
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
      this.afs.doc(`posts/${this.postID}`).update({
        characterName: this.characterName,
        characterDesc: this.characterDesc,
        animeName: this.animeName,
        characterSexe: this.characterSexe,
        characterAge: this.characterAge,
        characterType: this.characterType,
        mangaCheckbox: this.mangaCheckbox,
        animeCheckbox: this.animeCheckbox,
        movieCheckbox: this.movieCheckbox,
        characterHair: this.characterHair,
        characterHairColor: this.characterHairColor,
        characterEyes: this.characterEyes,
        characterEyesColor: this.characterEyesColor
      })
      this.presentAlert("Els canvis s'han efectuat correctament")
    }
  }

  // searchAnimeChars(animeName){
  //   let navigationExtras: NavigationExtras = {
  //    queryParams:{
  //      special: animeName
  //    } 
  //   }
  //   this.router.navigate(['/tabs/feed'], navigationExtras)
  // }

}
