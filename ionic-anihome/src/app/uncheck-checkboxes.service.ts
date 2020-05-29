import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UncheckCheckboxesService {
  $uncheckEvent = new EventEmitter();


  constructor() { }
  
  enviarEventUncheck(){

    this.$uncheckEvent.emit();
  }
}






  