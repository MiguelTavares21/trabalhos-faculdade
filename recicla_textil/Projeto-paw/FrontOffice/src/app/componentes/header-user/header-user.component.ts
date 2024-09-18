import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

}
