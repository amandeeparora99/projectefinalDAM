import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FeedPage } from './feed/feed.page';
import { FilterServiceService } from './filter-service.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from './user.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public characterSexe = [
    { camp: 'characterSexe', valDatabase: 'masculi', val: 'Masculí', isChecked: false },
    { camp: 'characterSexe', valDatabase: 'femeni', val: 'Femení', isChecked: false },
    { camp: 'characterSexe', valDatabase: 'altre', val: 'Altre', isChecked: false }
  ];

  public characterAge = [
    { camp: 'characterAge', valDatabase: 'nen', val: 'Nen', isChecked: false },
    { camp: 'characterAge', valDatabase: 'adolescent', val: 'Adolescent', isChecked: false },
    { camp: 'characterAge', valDatabase: 'adult-jove', val: 'Adult jove', isChecked: false },
    { camp: 'characterAge', valDatabase: 'mitjana-edat', val: 'Mitjana edat', isChecked: false },
    { camp: 'characterAge', valDatabase: 'vell', val: 'Vell', isChecked: false },
    { camp: 'characterAge', valDatabase: 'senseedat', val: 'Sense edat', isChecked: false }
  ];

  public characterType = [
    { camp: 'characterType', valDatabase: 'huma', val: 'Humà', isChecked: false },
    { camp: 'characterType', valDatabase: 'animal', val: 'Animal', isChecked: false },
    { camp: 'characterType', valDatabase: 'sobrenatural', val: 'Sobrenatural', isChecked: false },
    { camp: 'characterType', valDatabase: 'robot', val: 'Robot/Cyborg', isChecked: false },
    { camp: 'characterType', valDatabase: 'altre', val: 'Altre/No humà', isChecked: false },
  ];

  public characterHair = [
    { camp: 'characterHair', valDatabase: 'curt', val: 'Curt', isChecked: false },
    { camp: 'characterHair', valDatabase: 'alturacoll', val: 'Altura Coll', isChecked: false },
    { camp: 'characterHair', valDatabase: 'llarg', val: 'Llarg', isChecked: false },
    { camp: 'characterHair', valDatabase: 'moltllarg', val: 'Molt llarg', isChecked: false },
    { camp: 'characterHair', valDatabase: 'sense', val: 'Sense cabells', isChecked: false }
  ];

  public characterHairColor = [
    { camp: 'characterHairColor', valDatabase: 'sense', val: 'Sense cabells', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'negre', val: 'Negre', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'ros', val: 'Ros/Groc', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'blau', val: 'Blau', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'castany', val: 'Castany/Marró', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'verd', val: 'Verd', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'taronja', val: 'Taronja', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'lila', val: 'Lila', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'vermell', val: 'Vermell', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'rosa', val: 'Rosa', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'blanc', val: 'Blanc', isChecked: false },
    { camp: 'characterHairColor', valDatabase: 'altre', val: 'Altre', isChecked: false },
  ];

  public characterEyes = [
    { camp: 'characterEyes', valDatabase: 'normals', val: 'Normals', isChecked: false },
    { camp: 'characterEyes', valDatabase: 'petits', val: 'Petits', isChecked: false },
    { camp: 'characterEyes', valDatabase: 'grans', val: 'Grans', isChecked: false },
    { camp: 'characterEyes', valDatabase: 'no-visibles', val: 'No visibles', isChecked: false },

  ];

  public characterEyesColor = [
    { camp: 'characterEyesColor', valDatabase: 'no-visibles', val: 'No visibles', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'negre', val: 'Negre', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'groc', val: 'Groc', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'blau', val: 'Blau', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'marro', val: 'Marró', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'verd', val: 'Verd', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'taronja', val: 'Taronja', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'lila', val: 'Lila', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'vermell', val: 'Vermell', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'rosa', val: 'Rosa', isChecked: false },
    { camp: 'characterEyesColor', valDatabase: 'blanc', val: 'Blanc', isChecked: false },
  ];

  public valorBoolea: boolean = true

  public animeCheckbox = [
    { camp: 'animeCheckbox', valDatabase: this.valorBoolea, val: 'Sí', isChecked: false }
  ];

  public mangaCheckbox = [
    { camp: 'mangaCheckbox', valDatabase: this.valorBoolea, val: 'Sí', isChecked: false }
  ];

  public movieCheckbox = [
    { camp: 'movieCheckbox', valDatabase: this.valorBoolea, val: 'Sí', isChecked: false }
  ];



  public filtres = [];

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'mail'
    },
    {
      title: 'Outbox',
      url: '/folder/Outbox',
      icon: 'paper-plane'
    },
    {
      title: 'Favorites',
      url: '/folder/Favorites',
      icon: 'heart'
    },
    {
      title: 'Archived',
      url: '/folder/Archived',
      icon: 'archive'
    },
    {
      title: 'Trash',
      url: '/folder/Trash',
      icon: 'trash'
    },
    {
      title: 'Spam',
      url: '/folder/Spam',
      icon: 'warning'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private filterService: FilterServiceService,
    private menu: MenuController,
    private router: Router,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());

    }
  }

  logout() {
    console.log("fer logout my friend")
  }

  filtrarArray() {
    this.menu.close('sidebar')

    var context = this
    this.filtres = []

    this.filtres.push(this.characterSexe)
    this.filtres.push(this.characterAge)
    this.filtres.push(this.characterEyes)
    this.filtres.push(this.characterEyesColor)
    this.filtres.push(this.characterHair)
    this.filtres.push(this.characterHairColor)
    this.filtres.push(this.characterType)
    this.filtres.push(this.animeCheckbox)
    this.filtres.push(this.mangaCheckbox)
    this.filtres.push(this.movieCheckbox)



    //Es recorra els checkboxes de sexe en busca de activats
    /*this.characterSexe.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de rang d'edat en busca de activats
    this.characterAge.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de tipus en busca de activats
    this.characterType.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de cabells en busca de activats
    this.characterHair.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de color de cabells en busca de activats
    this.characterHairColor.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de ulls en busca de activats
    this.characterEyes.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de color d'ulls en busca de activats
    this.characterEyesColor.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes apareix anime en busca de activats
    this.animeCheckbox.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de apareix manga en busca de activats
    this.mangaCheckbox.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });

    //Es recorra els checkboxes de apareix pel·licula en busca de activats
    this.movieCheckbox.forEach(function (value) {
      if (value.isChecked == true) {
        context.filtres.push(value)
      }
    });
    */

    this.filterService.enviarFiltres(this.filtres);
  }
}
