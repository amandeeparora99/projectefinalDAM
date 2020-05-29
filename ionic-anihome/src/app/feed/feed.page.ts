import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FilterServiceService } from '../filter-service.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  arrayFilters = []
  posts = []
  noPostsFound: boolean = false
  mainuser
  sub
  sub2
  sub3
  isAdmin: string = ''
  postAlreadyInPosts: boolean = false

  totalData

  nousPosts: any = []
  segonaFase: any = []
  terceraFase = []
  quartaFase = []
  cinquenaFase = []
  sisenaFase = []
  setenaFase = []
  vuitenaFase = []
  novenaFase = []
  finalFase = []

  // animeName: string = ""


  constructor(
    private afs: AngularFirestore,
    private user: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterServiceService,
    private menu: MenuController
  ) {

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
    this.noPostsFound = false
    this.filterService
    this.mainuser = this.afs.doc(`users/${this.user.getUID()}`)
    console.log("HA ENTRAT A FEED EL USER: " + this.mainuser)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.isAdmin = event.isAdmin
      this.posts = []
      if (event.isAdmin == '') {
        console.log("Mostrant posts accepted perque no es admin")
        this.getAllPostsNotAdmin()
      }
      else {
        console.log("Mostrant all posts accepted perque ES admin")
        this.getAllPosts()
      }
    })


    //SI ES CLICA SOBRE FILTRAR AQUI ES REP EL ARRAY AMB ELS FILTRES

    this.filterService.$arrayFiltres
      .subscribe(data => {

        console.log("========================================")

        this.totalData = data

        console.log(this.totalData)

        if (this.totalData[0][0].isChecked == false && this.totalData[0][1].isChecked == false && this.totalData[0][2].isChecked == false) {
          console.log("NO HAS CLICAT CAP DELS CAMPS IMPORTANTS")
        }
        else {
          this.postsClear()
          this.totalData[0].forEach(sexeOption => {
            if (sexeOption.isChecked) {
              console.log(sexeOption.valDatabase)

              if (this.isAdmin == '') {
                this.getPostsGenderNoAdmin(sexeOption.valDatabase)

              }
              else {
                this.getPostsGender(sexeOption.valDatabase)

              }

            }
          });





        }



      })



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

  postsClear() {
    this.posts = []
    this.nousPosts = []
    this.segonaFase = []
    this.terceraFase = []
    this.quartaFase = []
    this.cinquenaFase = []
    this.sisenaFase = []
    this.setenaFase = []
    this.vuitenaFase = []
    this.novenaFase = []
    this.finalFase = []
    console.log("Posts netejats")
  }


  buscarPerRangEdat(arrayEdats) {
    if (!arrayEdats[0].isChecked && !arrayEdats[1].isChecked && !arrayEdats[2].isChecked && !arrayEdats[3].isChecked && !arrayEdats[4].isChecked && !arrayEdats[5].isChecked && !arrayEdats[5].isChecked) {
      this.segonaFase = this.nousPosts
      console.log("No Age selected")
    }
    else {

      arrayEdats.forEach(edat => {

        if (edat.isChecked) {
          console.log(edat.valDatabase)

          this.nousPosts.forEach(post => {

            if (post.Data.characterAge == edat.valDatabase) {
              this.segonaFase.push({
                'Data': post.Data,
                'Id': post.Id
              })
            }
          });

        }

      });


    }
  }

  buscarPerTipus(arrayTipus) {
    if (!arrayTipus[0].isChecked && !arrayTipus[1].isChecked && !arrayTipus[2].isChecked && !arrayTipus[3].isChecked && !arrayTipus[4].isChecked) {
      this.terceraFase = this.segonaFase
      console.log("No type selected")
      //this.buscarPerCabells(this.totalData[4])
    }
    else {
      arrayTipus.forEach(tipus => {

        if (tipus.isChecked) {
          console.log(tipus.valDatabase)

          this.segonaFase.forEach(post => {
            if (post.Data.characterType == tipus.valDatabase) {
              this.terceraFase.push({
                'Data': post.Data,
                'Id': post.Id
              })
            }
          })

        }

      });

      //this.buscarPerCabells(this.totalData[4])

    }
  }

  buscarPerCabells(arrayCabells) {
    if (!arrayCabells[0].isChecked && !arrayCabells[1].isChecked && !arrayCabells[2].isChecked && !arrayCabells[3].isChecked && !arrayCabells[4].isChecked) {
      this.quartaFase = this.terceraFase
      console.log("No hair selected")
      //this.buscarPerColorCabell(this.totalData[5])
    }
    else {
      arrayCabells.forEach(cabell => {

        if (cabell.isChecked) {
          console.log(cabell.valDatabase)

          this.terceraFase.forEach(post => {
            if (post.Data.characterHair == cabell.valDatabase) {
              this.quartaFase.push({
                'Data': post.Data,
                'Id': post.Id
              })
            }
          })
        }

      });

      //this.buscarPerColorCabell(this.totalData[5])

    }
  }

  buscarPerColorCabell(arrayColorCabells) {
    if (!arrayColorCabells[0].isChecked && !arrayColorCabells[1].isChecked && !arrayColorCabells[2].isChecked && !arrayColorCabells[3].isChecked && !arrayColorCabells[4].isChecked &&
      !arrayColorCabells[5].isChecked && !arrayColorCabells[6].isChecked && !arrayColorCabells[7].isChecked && !arrayColorCabells[8].isChecked && !arrayColorCabells[9].isChecked &&
      !arrayColorCabells[10].isChecked && !arrayColorCabells[11].isChecked) {
      this.cinquenaFase = this.quartaFase
      console.log("No hair color selected")
      //this.buscarPerUlls(this.totalData[2])
    }
    else {
      arrayColorCabells.forEach(cabellcolor => {

        if (cabellcolor.isChecked) {
          console.log(cabellcolor.valDatabase)

          this.quartaFase.forEach(post => {
            if (post.Data.characterHairColor == cabellcolor.valDatabase) {
              this.cinquenaFase.push({
                'Data': post.Data,
                'Id': post.Id
              })
            }
          })
        }

      });

      //this.buscarPerUlls(this.totalData[2])
    }
  }

  buscarPerUlls(arrayUlls) {
    if (!arrayUlls[0].isChecked && !arrayUlls[1].isChecked && !arrayUlls[2].isChecked && !arrayUlls[3].isChecked) {
      this.sisenaFase = this.cinquenaFase
      console.log("No eyes selected")
    }
    else {
      arrayUlls.forEach(ulls => {

        if (ulls.isChecked) {
          console.log(ulls.valDatabase)

          this.cinquenaFase.forEach(post => {
            if (post.Data.characterEyes == ulls.valDatabase) {
              this.sisenaFase.push({
                'Data': post.Data,
                'Id': post.Id
              })
            }
          })
        }

      });

    }
  }

  buscarPerUllsColor(arrayUllsColor) {
    if (!arrayUllsColor[0].isChecked && !arrayUllsColor[1].isChecked && !arrayUllsColor[2].isChecked && !arrayUllsColor[3].isChecked && !arrayUllsColor[4].isChecked &&
      !arrayUllsColor[5].isChecked && !arrayUllsColor[6].isChecked && !arrayUllsColor[7].isChecked && !arrayUllsColor[8].isChecked && !arrayUllsColor[9].isChecked &&
      !arrayUllsColor[10].isChecked) {
      console.log("No Eyes color selected")
      this.setenaFase = this.sisenaFase
    }
    else {
      arrayUllsColor.forEach(ullsColor => {

        if (ullsColor.isChecked) {
          console.log(ullsColor.valDatabase)

          this.sisenaFase.forEach(post => {
            if (post.Data.characterEyesColor == ullsColor.valDatabase) {
              this.setenaFase.push({
                'Data': post.Data,
                'Id': post.Id
              })
            }
          })
        }

      });
    }
  }

  pertanyAUnAnime(arrayAnime) {
    if (!arrayAnime[0].isChecked) {
      console.log("No pertany anime")
      this.vuitenaFase = this.setenaFase
    }
    else {
      this.setenaFase.forEach(post => {
        if (post.Data.animeCheckbox == arrayAnime[0].valDatabase) {
          this.vuitenaFase.push({
            'Data': post.Data,
            'Id': post.Id
          })
        }
      })
    }
  }

  pertanyAUnManga(arrayManga) {
    if (!arrayManga[0].isChecked) {
      this.novenaFase = this.vuitenaFase
      console.log("No pertany manga")
    }
    else {
      this.vuitenaFase.forEach(post => {
        if (post.Data.mangaCheckbox == arrayManga[0].valDatabase) {
          this.novenaFase.push({
            'Data': post.Data,
            'Id': post.Id
          })
        }
      })
    }
  }

  pertanyAUnMovie(arrayMovie) {
    if (!arrayMovie[0].isChecked) {
      this.finalFase = this.novenaFase
      console.log("No pertany a una peli")
    }
    else {
      this.vuitenaFase.forEach(post => {
        if (post.Data.mangaCheckbox == arrayMovie[0].valDatabase) {
          this.finalFase.push({
            'Data': post.Data,
            'Id': post.Id
          })
        }
      })
    }
  }

  obrirMenu() {

    this.menu.enable(true, 'sidebar');
    this.menu.open('sidebar');
    console.log("clicat el obrir menu")

  }

  getAllPosts() {
    //AQUI CARREGAR NOMES ELS ACCEPTED
    this.afs.collection('posts').get().toPromise().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        this.posts.push({
          'Data': doc.data(),
          'Id': doc.id
        })
      });
    })
  }

  getPostsGender(gender) {

    this.afs.collection('posts').get().toPromise().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().characterSexe == gender) {
          setTimeout(() => {
            this.nousPosts.push({
              'Data': doc.data(),
              'Id': doc.id
            })
            console.log("PUSHED:" + this.nousPosts.length);
          }, 0);

        }
      });

      setTimeout(() => {
        this.buscarPerRangEdat(this.totalData[1])
        console.log(this.segonaFase)
        this.buscarPerTipus(this.totalData[6])
        console.log(this.terceraFase)
        this.buscarPerCabells(this.totalData[4])
        console.log(this.quartaFase)
        this.buscarPerColorCabell(this.totalData[5])
        console.log(this.cinquenaFase)
        this.buscarPerUlls(this.totalData[2])
        console.log(this.sisenaFase)
        this.buscarPerUllsColor(this.totalData[3])
        console.log(this.setenaFase)
        this.pertanyAUnAnime(this.totalData[7])
        console.log(this.vuitenaFase)
        this.pertanyAUnManga(this.totalData[8])
        console.log(this.novenaFase)
        this.pertanyAUnMovie(this.totalData[9])
        console.log(this.finalFase)
        console.log("DONE")
        this.updatePosts()
      }, 0);
    })

  }

  updatePosts() {
    this.posts = []
    this.finalFase.forEach(e => {
      this.posts.push({
        'Data': e.Data,
        'Id': e.Id
      })
    });
    if (this.posts.length == 0) {
      this.noPostsFound = true
    }
    else {
      this.noPostsFound = false
    }
  }

  getPostsGenderNoAdmin(gender: string) {
    this.afs.collection('posts').get().toPromise().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().status == 'accepted' && doc.data().characterSexe == gender) {
          this.nousPosts.push({
            'Data': doc.data(),
            'Id': doc.id
          })
        }
      });
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
        
        // this.posts = []
        // this.finalFase.forEach(post => {
        //   if(post.Data.characterName.toUpperCase().includes(caps) || post.Data.animeName.toUpperCase().includes(caps)){
        //     this.posts.push({
        //       'Data': post.Data,
        //       'Id': post.Id
        //     })
        //   }
        // });

        if (this.posts.length == 0) {
          this.noPostsFound = true
        }
        else {
          this.noPostsFound = false
        }
      })
    }
  }

  getAllPostsNotAdmin() {
    //AQUI CARREGAR NOMES ELS ACCEPTED
    this.afs.collection('posts').get().toPromise().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        if (doc.data().status == 'accepted') {
          this.posts.push({
            'Data': doc.data(),
            'Id': doc.id
          })
        }
      });
    })
    this.noPostsFound = false
  }

  goTo(postID: string) {
    console.log("POST ID ABANS DE SER ENVIAT A TABS: " + postID)
    this.router.navigate(['/tabs/post/' + postID])
  }

  statusColor(status: string) {
    if (status == "pending") {
      return "warning"
    }
    else if (status == "accepted") {
      return "success"
    }
    else {
      return "danger"
    }
  }
}
