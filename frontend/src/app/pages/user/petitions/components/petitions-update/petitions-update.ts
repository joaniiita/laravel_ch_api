import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Petition} from '../../../../../models/petition';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {CategoryService} from '../../../../../shared/categories/category';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-petitions-update',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './petitions-update.html',
  styleUrl: './petitions-update.css',
})
export class PetitionsUpdate {
  private aRouter = inject(ActivatedRoute);
  private petitionService = inject(PetitionService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  id!: number;
  petition!: Petition;
  error: any = null;
  successMessage: any = null;
  categories: any[] = [];

  ngOnInit() {
    this.id = this.aRouter.snapshot.params['id'];

    this.petitionService.find(this.id).subscribe({
      next: (data) => {
        this.petition = data
        console.log(data);
      },
      error: (err) => console.log(err)
    });

    this.getCategories();
  }

  updatePetition() {
    this.petitionService.update(this.id, this.petition).subscribe({
      next: (data) => {
        console.log(data);
        this.successMessage = data.message;
        this.router.navigate(['/petitions']);

      },
      error: (err) => {
        this.error = err.error;
        console.log(err);
      }
    })
  }

  getCategories() {
    this.categoryService.index().subscribe({
      next: (data) => {
        this.categories = data;
        console.log(data);
      },
      error : (err) => console.log(err)
    })
  }

  getUrl(image: string){
    return 'http://localhost:8000/assets/images/petitions/' + image;
  }
}
