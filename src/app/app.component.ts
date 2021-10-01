import { User } from './shared/models/user';
import { AuthService } from './shared/services/auth-service/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public openedMenu: boolean = false;
  public user!: User;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(x => {
      console.log(x);
      this.user = x});
  }

  changeopenedMenu(){
    this.openedMenu = !this.openedMenu;
  }
}
