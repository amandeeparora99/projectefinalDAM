import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FilterServiceService } from '../filter-service.service';

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
  isAdmin: string = ''
  postAlreadyInPosts: boolean = false

  // animeName: string = ""


  constructor(private afs: AngularFirestore, private user: UserService, private router: Router, private route: ActivatedRoute, private filterService: FilterServiceService) {

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
        this.arrayFilters = data
        console.log(this.arrayFilters)
        //Si no hi ha filtres RETORNAR GETALLPOSTS MY FRIEND, si hi ha filtres buidar posts i posar-hi els que 
        //compleixin els filtres
        if (this.arrayFilters.length != 0) {
          console.log("AQUI VEU QUE TE FILTRES")
          this.posts = []

          //S'agafen tots els posts de la base de dades
          //Iterar sobre tots els posts
          console.log("AQUI COMENS A ITERAR SOBRE FIREBASE POSTS")

          this.afs.collection('posts').get().toPromise().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              console.log("AQUI HA FET LA QUERY A LA BASE DE DADES")
              console.log(doc.data())


              this.arrayFilters.forEach(filter => {
                console.log("AQUI ITERA COMPROVANT FILTRS")

                if (doc.data()[filter.camp] == filter.valDatabase) {
                  this.postAlreadyInPosts = false
                  console.log("el filtre es igual aixi que s'entra en el array de posts si no hi es repetit")
                  //Recorro el array de posts per veure si el post ja hi és
                  //Si no hi és la variable postAlreadyInPost és false i pot 
                  //ferli push a dins de l'array

                  for (let post of this.posts) {
                    console.log("MIRANT ARRAY DE POSTS A VEURE SI ES TROBA REPETITS")
                    console.log(post.Id, doc.id)
                    console.log(this.postAlreadyInPosts)
                    if (this.posts.length != 0) {
                      if (post.Id == doc.id) {
                        this.postAlreadyInPosts = true
                        console.log("ja esta en el array de posts aixi que no es posa")
                      }
                    }

                  }

                  console.log(this.postAlreadyInPosts)
                  if (this.postAlreadyInPosts == false) {
                    this.posts.push({
                      'Data': doc.data(),
                      'Id': doc.id
                    })
                    
                    console.log("el post " + doc.data().characterName + " te el filtre " + filter.val + " i s'ha posat en el array de posts")
                  }
                }
              })
            });
            console.log(this.posts)
          })
        } else {
          this.posts = []
          this.getAllPostsNotAdmin()

        }
      })

//FALTA FER QUE SI NO TROBA POSTS AMB AQUWTS FILTRES QUE ESNENYI QUE NO SHA TROBAT CAP POST


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

      this.afs.collection('posts').get().toPromise().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          if (doc.data().characterName.toUpperCase().includes(caps) || doc.data().animeName.toUpperCase().includes(caps)) {
            this.posts.push({
              'Data': doc.data(),
              'Id': doc.id
            })
          }
        });
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
        if (doc.data().status == 'accepted') {
          this.posts.push({
            'Data': doc.data(),
            'Id': doc.id
          })
        }
      });
      console.log("AQUI TENIM L'ARRAY DE POSTS:")
      console.log(this.posts)
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
