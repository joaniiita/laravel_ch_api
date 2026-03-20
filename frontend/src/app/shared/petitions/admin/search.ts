import {computed, effect, inject, Injectable, OnInit} from '@angular/core';
import {AdminPetitionService} from './admin-petition';
import {CategoryService} from '../../categories/category';
import {AdminUserService} from '../../users/user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Search{

  private readonly adminPetition = inject(AdminPetitionService);
  private readonly categoryService = inject(CategoryService);
  private readonly userService = inject(AdminUserService)

  private readonly router = inject(Router)

  petitions = this.adminPetition.petitions;
  categories = this.categoryService.categories;
  users = this.userService.users;

  constructor() {
    this.adminPetition.getPetition();
    this.categoryService.getCategories();
    this.userService.getUsers();
  }

  // Ahora para poder filtrarlos los unimos todosss
  allItems = computed( () =>
    // return [...this.petitions(), ...this.categories(), ...this.users()]
    [
      ...this.petitions().map( p => ({label: p.title, link: '/admin/petition/' + p.id, type: 'Petition'})),
      ...this.categories().map( c => ({label: c.name, link: '/admin/category/' + c.id, type: 'Category'})),
      ...this.users().map( u => ({label: u.name, link: '/admin/user/' + u.id, type: 'User'})),
    ])



  onSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const valueFound = this.allItems().find( item => item.label.toLowerCase().includes(value.toLowerCase()));

    if (valueFound) {
      this.router.navigate([valueFound.link]);
      input.value = '';
    }
  }
}
