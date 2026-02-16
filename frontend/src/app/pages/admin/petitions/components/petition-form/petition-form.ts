import {Component, effect, inject, input, InputSignal, output, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Category} from '../../../../../models/category';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {CategoryService} from '../../../../../shared/categories/category';
import {AdminPetitionService} from '../../../../../shared/petitions/admin/admin-petition';

@Component({
  selector: 'app-petition-form',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './petition-form.html',
  styleUrl: './petition-form.css',
})
export class PetitionForm {

  // El input. se utiliza cuando los datos vienen de fuera del componente
  mode = input.required<'create' | 'edit' | 'show'>();
  initialData : InputSignal<any> = input<any>(null);

  save = output<any>();

  // El signal si es de dentro
  selectedFile = signal<File | null>(null);
  categories = signal<Category[]>([]);
  petition = signal<any>({});
  id = signal<number>(0);

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private aRouter = inject(ActivatedRoute);
  private aPetitionService = inject(AdminPetitionService);

  petitionForm!: FormGroup;

  constructor() {
    // Esto es para ver si cambia algo que se hagan cambios asíncronos (como un watch en vue)
    effect(() => {
      const data = this.initialData();
      if (data){
        this.petitionForm.patchValue(data, { emitEvent: false});
      }
    });
  }

  ngOnInit(){
    this.petitionForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      destinatary: ['', [Validators.required]],
    });

    this.getCategories();

    if (this.mode() === 'show'){
      this.petitionForm.disable();
      this.id.set(this.aRouter.snapshot.params['id']);
      this.aPetitionService.find(this.id()).subscribe({
        next: (data) => this.petition.set(data),
        error: (err) => console.log(err)
      })
    }
  }

  onSubmit(){
    if (this.petitionForm.valid){
      const formData = new FormData();

      const image = this.selectedFile();

      formData.append('title', this.petitionForm.get('title')?.value);
      formData.append('description', this.petitionForm.get('description')?.value);
      formData.append('category_id', this.petitionForm.get('category_id')?.value);
      formData.append('destinatary', this.petitionForm.get('destinatary')?.value);

      // Si la imagen no es nula lo agregamos al formulario (que sino sale un error de tipado)
      if (image !== null){
        formData.append('image', image, image.name);
      }

      // Enviamos al padre el formData para que él llame al servicio necesario (edit o create)
      this.save.emit(formData);

    }
  }

  getCategories(){
    this.categoryService.index().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.log(err),
    })
  }

  onSelectedFile(event: any){
    const input = event?.target as HTMLInputElement;
    if (input.files?.length){
      this.selectedFile.set(input.files[0]);
      console.log(this.selectedFile());
    }
  }

  getImageUrl(image: string){
    return 'http://localhost:8000/storage/assets/images/petitions/' + image;
  }
}
