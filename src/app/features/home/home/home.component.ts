import { Component } from '@angular/core';
import {TopHeaderComponent} from '../../../shared/components/top-header/top-header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent,RouterOutlet,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
