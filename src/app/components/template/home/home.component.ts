import { AuthService } from './../../../shared/services/auth-service/auth.service';
import { AuthorizationUser } from './../../../shared/models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public userLogged!: AuthorizationUser;
  
  constructor(private authService: AuthService) {
    this.userLogged = this.authService.loggedUser;
  }

  ngOnInit(): void {
  }
}
