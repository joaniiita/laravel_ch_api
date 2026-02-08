import {Component, inject} from '@angular/core';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-signed-petitions',
  imports: [
    RouterLink
  ],
  templateUrl: './signed-petitions.html',
  styleUrl: './signed-petitions.css',
})
export class SignedPetitions {
    signedPetitions : any[] = [];

    private petitionService = inject(PetitionService);

    constructor() {
    }

    ngOnInit(){
      this.getSignedPetitions()
    }

    getSignedPetitions(){
        this.petitionService.signedPetitions().subscribe({
            next: (data) => {
                this.signedPetitions = data;
            },
            error: (err) => console.log(err)
        })
    }

    getUrl(image: string){
        return 'http://localhost:8000/assets/images/petitions/' + image;
    }
}
