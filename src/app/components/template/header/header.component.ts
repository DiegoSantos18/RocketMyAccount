import { HeaderService } from './header.service';
import { NavService } from './../nav/nav.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private sidenavService: NavService, private headerService: HeaderService) {}

   ngOnInit() {}

  btnOpenedMenuClick(event: any){
    if(event){
      this.sidenavService.toggle();
    }
  }

  get title(): string{
    return this.headerService.headerData.title;
  }

  get icon(): string{
    return this.headerService.headerData.icon;
  }

  get routeUrl(): string{
    return this.headerService.headerData.routeUrl;
  }

}
