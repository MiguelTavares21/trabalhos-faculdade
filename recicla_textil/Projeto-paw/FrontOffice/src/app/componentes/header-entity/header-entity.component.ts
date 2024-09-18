import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-entity',
  standalone: true,
  imports: [],
  templateUrl: './header-entity.component.html',
  styleUrl: './header-entity.component.css'
})
export class HeaderEntityComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

}
