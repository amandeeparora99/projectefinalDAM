import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  mainuser: AngularFirestoreDocument
  sub
  username: string
  profilePic: string

  busy: boolean = false
  password: string
  newpassword: string

  @ViewChild('fileBtn', {static: false}) fileBtn: {
    nativeElement: HTMLInputElement
  }
  constructor(
    private http: HttpClient, 
    private afs: AngularFirestore,
    private user: UserService,
    private router: Router,
    private alertController: AlertController) { 

    this.mainuser = afs.doc(`users/${user.getUID()}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.username = event.username
      this.profilePic = event.profilePic
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  updateProfilePic() {
    this.fileBtn.nativeElement.click()
  }

  uploadPic(event) {
    const files = event.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE', '1')
    data.append('UPLOADCARE_PUB_KEY', '1ad55f3c8983ea0341bb')

    this.http.post<any>('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
      const uuid = event.file
      console.log("EL UUID ES: "+uuid)
      this.mainuser.update({
        profilePic: uuid
      })
    })
  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['OK']
    })
  }

  async updateDetails() {
    this.busy = true

    if(!this.password) {
      this.busy = false
      return this.presentAlert("Error", "Has d'introduir la contrasenya actual per fer canvis!")
    }

    try {
      await this.user.reAuth(this.user.getUsername(), this.password)
    } catch (error) {
      this.busy = false
      return this.presentAlert("Error", "Contrasenya incorrecta")
    }

    if(this.newpassword) {
      await this.user.updatePassword(this.newpassword)
    }

    this.password = ""
    this.newpassword = ""
    this.busy = false

    await this.presentAlert("Fet!", "Perfil editat correctament")

    this.router.navigate(['/tabs/profile'])
    
  }
}