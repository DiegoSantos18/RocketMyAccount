import { HeaderService } from './../header/header.service';
import { AuthService } from './../../../shared/services/auth-service/auth.service';
import { AuthUser } from './../../../shared/models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userLogged!: AuthUser;
  
  constructor(private authService: AuthService, private headerService: HeaderService) {
    this.userLogged = this.authService.loggedUser;
    headerService.headerData = {
      title: 'Dashboard',
      icon: 'dashboard',
      routeUrl: '/dashboard'
    };
  }

  ngOnInit(): void {
  }
}
