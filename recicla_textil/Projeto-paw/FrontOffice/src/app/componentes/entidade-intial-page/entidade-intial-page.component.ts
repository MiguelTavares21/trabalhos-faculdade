import { HeaderEntityComponent } from './../header-entity/header-entity.component';
import { Component } from '@angular/core';
import { AboutUsComponent } from '../about-us/about-us.component';

@Component({
  selector: 'app-entidade-intial-page',
  standalone: true,
  imports: [HeaderEntityComponent, AboutUsComponent],
  templateUrl: './entidade-intial-page.component.html',
  styleUrl: './entidade-intial-page.component.css'
})
export class EntidadeIntialPageComponent {

}
