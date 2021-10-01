import { Router } from '@angular/router';
import { NavService } from './../nav/nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  _route!: Router;

  constructor(private sidenavService: NavService, public router: Router) {
    this._route = router;
  }

   ngOnInit() {
    console.log(this._route);
   }

  btnOpenedMenuClick(event: any){
    if(event){
      this.sidenavService.toggle();
    }
  }

}
