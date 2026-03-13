import {Component, computed, inject, signal} from '@angular/core';
import {PetitionService} from '../../../shared/petitions/petition';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Petition} from '../../../models/petition';
import {Category} from '../../../models/category';
import {CategoryService} from '../../../shared/categories/category';

@Component({
  selector: 'app-petitions',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './petitions.html',
  styleUrl: './petitions.css',
})
export class Petitions {
  petitions = signal<Petition[]>([])
  private petitionService = inject(PetitionService)
  private categoryService = inject(CategoryService)
  clone: Petition[] = [];
  categories = signal<Category[]>([]);

  status = signal<string>('all');
  category = signal<string>('all');
  search = signal<string>('');

  currentPage = signal<number>(1);
  totalFilteredItems = signal<number>(0);
  lastPage = computed(() => Math.ceil(this.totalFilteredItems() / 2));


  constructor() {
  }

  ngOnInit() {
    this.getPetitions();
    this.getCategories();
  }

  getPetitions() {
    this.petitionService.index().subscribe(data => {
      this.petitions.set(data)
      this.clone = data;
      this.filterAllPetitions();
    });
  }

  getCategories() {
    this.categoryService.index().subscribe(data => this.categories.set(data));
  }

  // filterPetitionsBySearchBar(event : any){
  //   const input = event.target.value;
  //
  //   if (input.length === 0 || input === '') {
  //     this.petitions.set(this.clone);
  //   } else {
  //     const filtered = this.clone.filter(peti => peti.title.toLowerCase().includes(input.toLowerCase()));
  //     this.petitions.set(filtered);
  //   }
  // }

  // filterPetitionsByStatus(event: any) {
  //   const select = event.target.value;
  //   console.log(select)
  //   if (select === 'all') {
  //     this.petitions.set(this.clone);
  //   } else if (select === 'not-signed') {
  //     const filtered = this.clone.filter(peti => {
  //       return Number(peti.signers) === 0
  //     });
  //     this.petitions.set(filtered);
  //   } else {
  //     const filtered = this.clone.filter(peti => {
  //       return Number(peti.signers) > 0
  //     });
  //     this.petitions.set(filtered);
  //   }
  // }
  //
  //
  // filterPetitionsByCategory(event: any) {
  //   const select = event.target.value;
  //   if (select === 'all') {
  //     this.petitions.set(this.clone);
  //   } else {
  //     const filtered = this.clone.filter(peti => {
  //       return peti.category_id === Number(select)
  //     });
  //     this.petitions.set(filtered);
  //   }
  // }

  filterPetitionsBySearchBar(event: any) {
    const input = event.target.value;
    this.search.set(input);
    this.filterAllPetitions();
  }

  filterPetitionsByStatus(event: any) {
    const select = event.target.value;
    this.status.set(select)
    this.filterAllPetitions();
  }

  filterPetitionsByCategory(event: any) {
    const select = event.target.value;
    this.category.set(select)
    this.filterAllPetitions();
  }

  filterAllPetitions() {
    let filtered = [...this.clone];

    if (this.status() === 'not-signed') {
      filtered = filtered.filter(peti => Number(peti.signers) === 0);
    } else if (this.status() === 'signed') {
      filtered = filtered.filter(peti => Number(peti.signers) > 0);
    }

    if (this.category() !== 'all') {
      filtered = filtered.filter(peti => peti.category_id === Number(this.category()));
    }

    if (this.search() !== '') {
      filtered = filtered.filter(peti => peti.title.toLowerCase().includes(this.search().toLowerCase()));
    }

    this.totalFilteredItems.set(filtered.length);

    const itemsPerPage = 2;
    const start = (this.currentPage() - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginated = filtered.slice(start, end);

    this.petitions.set(paginated);
  }

  pages = computed(() => {
    const list = [];

    for (let i = 1; i <= this.lastPage(); i++) {
      list.push(i);
    }

    return list;
  });

  changePage(page: number) {
    this.currentPage.set(page);
    this.filterAllPetitions();
  }

  getUrl(image: string) {
    return 'http://localhost:8000/storage/assets/images/petitions/' + image;
  }
}
