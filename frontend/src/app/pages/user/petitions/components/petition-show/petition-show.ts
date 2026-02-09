import {Component, inject} from '@angular/core';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Petition} from '../../../../../models/petition';
import {AuthService} from '../../../../../shared/auth/auth';

@Component({
  selector: 'app-petition-show',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './petition-show.html',
  styleUrl: './petition-show.css',
})
export class PetitionShow {
  signForm!: FormGroup;
  error: any = null;
  id!: number;
  petition!: Petition;

  private petitionService = inject(PetitionService);
  private activatedRoute = inject(ActivatedRoute);
  protected auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  constructor() {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.petitionService.find(this.id).subscribe({
      next: (data) => this.petition = data,
      error: (err) => console.log(err)
    })

    this.signForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      surname: ['', [Validators.required]],
    })
  }


  onSubmit() {
    this.petitionService.signPetition(this.petition.id, this.signForm.value).subscribe({
      next: () => this.router.navigate(['/petitions']),
      error: err => this.error = err.error
    })
  }

  deletePetition(id:number) {
    this.petitionService.delete(id).subscribe({
      next: () => this.router.navigate(['/petitions']),
    })
  }

  getUrl(image: string) {
    return 'http://localhost:8000/assets/images/petitions/' + image;
  }

  getUserUrl(image: string) {
    return 'http://localhost:8000/assets/images/user/' + image;
  }

}
