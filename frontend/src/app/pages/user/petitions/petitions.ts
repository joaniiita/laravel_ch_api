import {Component, inject} from '@angular/core';
import {PetitionService} from '../../../shared/petitions/petition';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-petitions',
  imports: [
    RouterLink
  ],
  templateUrl: './petitions.html',
  styleUrl: './petitions.css',
})
export class Petitions {
  protected petitions: any[] = [];
  private petitionService = inject(PetitionService)
  constructor() { }

  ngOnInit() {
    this.getPetitions();
  }

  getPetitions(){
    this.petitionService.index().subscribe(data => this.petitions = data);
  }



  getUrl(image: string){
    return 'http://localhost:8000/storage/assets/images/petitions/' + image;
  }
}
