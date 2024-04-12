import { Injectable } from '@angular/core';
import { Referential } from '../models/referential.model';
import { Dict } from '../models/record.model';
import { v4 as uuidv4 } from 'uuid';
import { View } from '../models/view.model';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  constructor() {}

  private _views: Dict<View> = new Map<string, View>();

  createDefaultViewFor(ref: Referential) {
    let view = new View("DEFAULT_VIEW", ref);
    ref.views.set(view.id, view);
    this._views.set(view.id, view);
  }

  getViewById(viewId: string): View | undefined {
    return this._views.get(viewId);
  }

  getDefaultViewOfRef(refId: string): View | undefined {
    for(let view of this._views.values()) {
      if (view.name === "DEFAULT_VIEW" && view.refId === refId) {
        return view;
      }
    }
    return undefined;
  }

  registerView(view: View) {
    this._views.set(view.id, view); 
  }

}
