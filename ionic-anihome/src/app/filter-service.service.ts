import { Injectable, EventEmitter } from '@angular/core';

@Injectable(({
  providedIn: 'root'
}))
export class FilterServiceService {
  $arrayFiltres = new EventEmitter();

  constructor() { }

  enviarFiltres(arrayFiltres){

    this.$arrayFiltres.emit(arrayFiltres);
  }
}
