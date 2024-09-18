import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { AboutUsComponent } from '../about-us/about-us.component';

@Component({
  selector: 'app-user-intial-page',
  standalone: true,
  imports: [HeaderUserComponent, AboutUsComponent],
  templateUrl: './user-intial-page.component.html',
  styleUrl: './user-intial-page.component.css'
})
export class UserIntialPageComponent {

}
