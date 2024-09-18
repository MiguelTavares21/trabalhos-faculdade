import { Component } from '@angular/core';
import { HeaderUserComponent } from '../header-user/header-user.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [HeaderUserComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {}
