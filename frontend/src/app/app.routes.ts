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
import {Dashboard} from './pages/admin/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  { path: 'petitions', component: Petitions },
  { path: 'petition/:id', component: PetitionShow},
  { path: 'petitionEdit/:id', component: PetitionsUpdate, canActivate: [authGuard] },
  { path: 'petitionCreate', component: PetitionsCreate, canActivate: [authGuard] },
  { path: 'myPetitions', component: MyPetitions, canActivate: [authGuard]},
  { path: 'signedPetitions', component: SignedPetitions, canActivate: [authGuard]},
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard]}

];
