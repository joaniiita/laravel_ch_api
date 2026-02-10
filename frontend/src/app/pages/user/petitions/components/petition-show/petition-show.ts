import {Component, inject} from '@angular/core';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Petition} from '../../../../../models/petition';
import {AuthService} from '../../../../../shared/auth/auth';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-petition-show',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './petition-show.html',
  styleUrl: './petition-show.css',
  standalone: true
})
export class PetitionShow {
  signForm!: FormGroup;
  error: any = null;
  id!: number;
  petition!: Petition;
  public currentUserId : number |null = null;

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
      next: (data) => {
        console.log(data);
        this.petition = data;
      },
      error: (err) => console.log(err)
    });

    this.auth.user$.subscribe(user => {
      this.currentUserId = user ? user.id : null;
    });

    this.auth.loadUserIfNeeded();

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
