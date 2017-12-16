import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class MapstateService {

  state: BehaviorSubject<any>;
  constructor() { 
    this.state = new BehaviorSubject({center:[0,0],zoom:0});
  }

  setState(_state){
    this.state.next(_state);
  }

  getState(){
    return this.state.asObservable();
  }

}
