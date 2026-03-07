import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {PetitionForm} from '../petition-form/petition-form';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {Category} from '../../../../../models/category';
import {AdminPetitionService} from '../../../../../shared/petitions/admin/admin-petition';

@Component({
  selector: 'app-petition-create',
  imports: [
    PetitionForm
  ],
  templateUrl: './petition-create.html',
  styleUrl: './petition-create.css',
})
export class AdminPetitionCreate {
    private aPetitionService = inject(AdminPetitionService);
    private router = inject(Router);

    errorMsg = signal<any>(null);

    handleSave(formData : FormData){
      this.aPetitionService.create(formData).subscribe({
        next: () => this.router.navigate(['/admin/petitions']),
        error: (err) => {
          console.log(err);
          this.errorMsg.set(Object.values(err.error))
        }
      })
    }
}
