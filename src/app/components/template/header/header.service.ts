import { HeaderData } from './../../../shared/models/header-data';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _headerData = new BehaviorSubject<HeaderData>({
    title: 'Início',
    icon: 'home',
    routeUrl: ''
  });

  constructor() { }

  get headerData(): HeaderData{
    return this._headerData.value;
  }

  set headerData(headerData: HeaderData){
    this._headerData.next(headerData);
  }
}
