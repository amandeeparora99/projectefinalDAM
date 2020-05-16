import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string

  constructor(public http: HttpClient) { 
    
  }

  ngOnInit() {
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
 
