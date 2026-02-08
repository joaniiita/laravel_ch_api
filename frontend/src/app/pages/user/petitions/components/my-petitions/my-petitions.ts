import {Component, inject} from '@angular/core';
import {Petition} from '../../../../../models/petition';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-my-petitions',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-petitions.html',
  styleUrl: './my-petitions.css',
})
export class MyPetitions {

  petitions: any[] = [];
  private router = inject(Router);
  private petitionService = inject(PetitionService);
  constructor() {
  }

  ngOnInit() {
    this.getMyPetitions();
  }

  getMyPetitions(){
    this.petitionService.myPetitions().subscribe({
      next: (data) => {
        this.petitions = data;
        console.log(data);
      },
      error: (err) => console.log(err)
    })
  }

  getUrl(image: string){
    return 'http://localhost:8000/assets/images/petitions/' + image;
  }
}
