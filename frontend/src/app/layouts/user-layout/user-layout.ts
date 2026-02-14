import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Footer} from '../../components/footer/footer';
import {UserNavbar} from '../../components/user-navbar/user-navbar';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, CommonModule, Footer, UserNavbar],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
  standalone: true
})
export class UserLayout {

}
