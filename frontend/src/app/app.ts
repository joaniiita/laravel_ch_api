import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Footer} from './components/footer/footer';
import {CommonModule} from '@angular/common';
import {AuthService} from './shared/auth/auth';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');


}
