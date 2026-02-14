import {Component, inject, output, signal} from '@angular/core';
import {PetitionService} from '../../../../shared/petitions/petition';
import {PetitionRow} from '../petition-row/petition-row';
import {Petition} from '../../../../models/petition';
import {RouterLink} from '@angular/router';
import {AdminPetitionService} from '../../../../shared/petitions/admin/admin-petition';


@Component({
  selector: 'app-petition-table',
  imports: [PetitionRow, RouterLink],
  templateUrl: './petition-table.html',
  styleUrl: './petition-table.css',
  standalone: true
})
export class PetitionTable {

  private adminPetitionService = inject(AdminPetitionService);

  petitions = signal<Petition[]>([]);
  onDelete = output<number>()
  constructor() { }

  ngOnInit(){
    this.getPetitions();
  }

  getPetitions(){
    this.adminPetitionService.index().subscribe({
      next: (data) => {
        this.petitions.set(data);
        console.log(data);
      },
      error: (err) => console.log(err)
    })
  }

  deletePetition(id:number){
    this.adminPetitionService.delete(id).subscribe({
      next: () => {
        this.petitions.update( data => data.filter(petition => petition.id !== id))
      },
      error: (err) => console.log(err)
    })
  }

  updateStatus(petition: Petition) {
    const newStatus = petition.status === 'pending' ? 'accepted' : 'pending';

    this.adminPetitionService.changeStatus(petition.id, { status: newStatus }).subscribe({
      next: (res: any) => {
        const updatedItem = res.data;
        this.petitions.update(list =>
          list.map(p => {
            if (p.id === petition.id) {
              return { ...p, ...updatedItem };
            }
            return p;
          })
        );

      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }


}
