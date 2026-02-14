import {Component, inject, signal} from '@angular/core';
import {PetitionForm} from '../petition-form/petition-form';
import {ActivatedRoute} from '@angular/router';
import {AdminPetitionService} from '../../../../../shared/petitions/admin/admin-petition';

@Component({
  selector: 'app-petition-show',
  imports: [
    PetitionForm
  ],
  templateUrl: './petition-show.html',
  styleUrl: './petition-show.css',
  standalone: true
})
export class AdminPetitionShow {

  petition = signal<any>({});
  id = signal<number>(0);

  private aRouter = inject(ActivatedRoute);
  private aPetitionService = inject(AdminPetitionService);

  ngOnInit(){
    this.id.set(this.aRouter.snapshot.params['id']);
    this.aPetitionService.find(this.id()).subscribe({
      next: (data) => this.petition.set(data),
      error: (err) => console.log(err)
    })
    console.log(this.petition(), this.id());
  }




}
