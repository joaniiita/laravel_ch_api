import {Component, inject, signal} from '@angular/core';
import {PetitionForm} from '../petition-form/petition-form';
import {ActivatedRoute, Router} from '@angular/router';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {AdminPetitionService} from '../../../../../shared/petitions/admin/admin-petition';

@Component({
  selector: 'app-petition-edit',
  imports: [
    PetitionForm
  ],
  templateUrl: './petition-edit.html',
  styleUrl: './petition-edit.css',
})
export class AdminPetitionEdit {

  private adminPetitionService = inject(AdminPetitionService);
  private router = inject(Router);
  private aRouter = inject(ActivatedRoute)

  errorMsg = signal<any>(null);
  id = signal<number>(0);
  petition = signal<any>({});
  constructor(){}

  ngOnInit(){
    this.id.set(this.aRouter.snapshot.params['id']);
    this.adminPetitionService.find(this.id()).subscribe({
      next: (data) => this.petition.set(data),
      error: (err) => console.log(err)
    })
  }

  handleSave(formData: FormData){
    formData.append('_method', 'PUT');
    this.adminPetitionService.update(this.id(),formData).subscribe({
      next: () => this.router.navigate(['/admin/petitions']),
      error: (err) => {
        console.log(err);
        this.errorMsg.set(Object.values(err.error))
      }
    })
  }
}
