import { Component } from '@angular/core';
import {AdminNavbar} from '../../components/admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminNavbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  standalone: true
})
export class AdminLayout {

}
