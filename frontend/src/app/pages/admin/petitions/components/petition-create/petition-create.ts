import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {PetitionForm} from '../petition-form/petition-form';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {Category} from '../../../../../models/category';

@Component({
  selector: 'app-petition-create',
  imports: [
    RouterLink,
    PetitionForm
  ],
  templateUrl: './petition-create.html',
  styleUrl: './petition-create.css',
})
export class AdminPetitionCreate {
    private petitionService = inject(PetitionService);
    private router = inject(Router);

    errorMsg = signal<any>(null);

    handleSave(formData : FormData){
      this.petitionService.create(formData).subscribe({
        next: () => this.router.navigate(['/admin/petitions']),
        error: (err) => {
          console.log(err);
          this.errorMsg.set(Object.values(err.error))
        }
      })
    }
}
