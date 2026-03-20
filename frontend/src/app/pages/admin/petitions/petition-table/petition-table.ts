import {Component, effect, inject, output, signal, WritableSignal} from '@angular/core';
import {PetitionService} from '../../../../shared/petitions/petition';
import {PetitionRow} from '../petition-row/petition-row';
import {Petition} from '../../../../models/petition';
import {RouterLink} from '@angular/router';
import {AdminPetitionService} from '../../../../shared/petitions/admin/admin-petition';
import {NgxPaginationModule} from 'ngx-pagination';


@Component({
  selector: 'app-petition-table',
  imports: [PetitionRow, RouterLink, NgxPaginationModule],
  templateUrl: './petition-table.html',
  styleUrl: './petition-table.css',
  standalone: true
})
export class PetitionTable {

  private adminPetitionService = inject(AdminPetitionService);

  petitions = signal<Petition[]>([]);
  onDelete = output<number>()
  page: WritableSignal<number> = signal<number>( 1 );
  pageSize: WritableSignal<number> = signal<number>( 2 );


  ngOnInit(){
    this.getPetitions();
  }

  getPetitions(){
    this.adminPetitionService.index().subscribe({
      next: (data) => {
        this.petitions.set(data);
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
