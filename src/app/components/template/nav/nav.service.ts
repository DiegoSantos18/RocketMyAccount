import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
	public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  	constructor() { } 

	public toggle() {
		return this.sideNavToggleSubject.next(null);
	}
}
