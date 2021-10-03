import { AuthService } from './../../../shared/services/auth-service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  get isLogged() { 
    return this.authService.loggedUser; 
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
}
