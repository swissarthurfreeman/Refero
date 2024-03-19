import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


  difference(arr1: Array<string>, arr2: Array<string>): Array<string> {
    return arr1.filter(item => arr2.indexOf(item) < 0);
  }
}
