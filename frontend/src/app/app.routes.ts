import { Routes } from '@angular/router';
import { Login } from './pages/user/auth/login/login';
import { Register } from './pages/user/auth/register/register';
import { Profile } from './pages/user/auth/profile/profile';
import {authGuard} from './shared/auth/auth-guard';
import {Home} from './pages/user/home/home';
import {Petitions} from './pages/user/petitions/petitions';
import {PetitionShow} from './pages/user/petitions/components/petition-show/petition-show';
import {PetitionsCreate} from './pages/user/petitions/components/petitions-create/petitions-create';
import {MyPetitions} from './pages/user/petitions/components/my-petitions/my-petitions';
import {SignedPetitions} from './pages/user/petitions/components/signed-petitions/signed-petitions';
import {PetitionsUpdate} from './pages/user/petitions/components/petitions-update/petitions-update';
import {UserLayout} from './layouts/user-layout/user-layout';
import {AdminLayout} from './layouts/admin-layout/admin-layout';
import {PetitionTable} from './pages/admin/petitions/petition-table/petition-table';
import {AdminPetitionEdit} from './pages/admin/petitions/components/petition-edit/petition-edit';
import {AdminPetitionShow} from './pages/admin/petitions/components/petition-show/petition-show';
import {AdminPetitionCreate} from './pages/admin/petitions/components/petition-create/petition-create';
import {CategoryTable} from './pages/admin/categories/category-table/category-table';
import {AdminCategoryCreate} from './pages/admin/categories/components/category-create/category-create';
import {AdminCategoryShow} from './pages/admin/categories/components/category-show/category-show';
import {AdminCategoryEdit} from './pages/admin/categories/components/category-edit/category-edit';
import {UserTable} from './pages/admin/users/user-table/user-table';
import {AdminUserEdit} from './pages/admin/users/components/user-edit/user-edit';
import {AdminUserShow} from './pages/admin/users/components/user-show/user-show';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home},
      { path: 'petitions', component: Petitions },
      { path: 'petition/:id', component: PetitionShow},
      { path: 'petitionEdit/:id', component: PetitionsUpdate, canActivate: [authGuard] },
      { path: 'petitionCreate', component: PetitionsCreate, canActivate: [authGuard] },
      { path: 'myPetitions', component: MyPetitions, canActivate: [authGuard]},
      { path: 'signedPetitions', component: SignedPetitions, canActivate: [authGuard]},
    ]
  },

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'petitions', component: PetitionTable, canActivate: [authGuard]},
      { path: 'petitionEdit/:id', component: AdminPetitionEdit, canActivate: [authGuard] },
      { path: 'petitionCreate', component: AdminPetitionCreate, canActivate: [authGuard] },
      { path: 'petition/:id', component: AdminPetitionShow, canActivate: [authGuard] },

      { path: 'categories', component: CategoryTable, canActivate: [authGuard]},
      { path: 'categoryEdit/:id', component: AdminCategoryEdit, canActivate: [authGuard] },
      { path: 'category/:id', component: AdminCategoryShow, canActivate: [authGuard] },
      { path: 'categoryCreate', component: AdminCategoryCreate, canActivate: [authGuard] },

      { path: 'users', component: UserTable, canActivate: [authGuard]},
      { path: 'userEdit/:id', component: AdminUserEdit, canActivate: [authGuard] },
      { path: 'user/:id', component: AdminUserShow, canActivate: [authGuard] },
    ]
  }

];
