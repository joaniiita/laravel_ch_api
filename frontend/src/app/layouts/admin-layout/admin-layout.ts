import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AdminNavbar} from '../../components/admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminNavbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  standalone: true
})
export class AdminLayout {

}
