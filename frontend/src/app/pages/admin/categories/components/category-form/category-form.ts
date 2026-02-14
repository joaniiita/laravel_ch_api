import {Component, effect, inject, input, InputSignal, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Category} from '../../../../../models/category';
import {CategoryService} from '../../../../../shared/categories/category';
import {AdminPetitionService} from '../../../../../shared/petitions/admin/admin-petition';

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  // El input. se utiliza cuando los datos vienen de fuera del componente
  mode = input.required<'create' | 'edit' | 'show'>();
  initialData : InputSignal<any> = input<any>(null);

  save = output<any>();

  // El signal si es de dentro
  category = signal<any>({});
  id = signal<number>(0);

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private aRouter = inject(ActivatedRoute);

  categoryForm!: FormGroup;

  constructor() {
    // Esto es para ver si cambia algo que se hagan cambios asíncronos (como un watch en vue)
    effect(() => {
      const data = this.initialData();
      if (data){
        this.categoryForm.patchValue(data, { emitEvent: false});
      }
    });
  }

  ngOnInit(){
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    if (this.mode() === 'show'){
      this.categoryForm.disable();
    }

    if (this.mode() === 'show'){
      this.id.set(this.aRouter.snapshot.params['id']);
      this.categoryService.find(this.id()).subscribe({
        next: (data) => this.category.set(data),
        error: (err) => console.log(err)
      })
    }
  }

  onSubmit(){
    if (this.categoryForm.valid){
      const formData = new FormData();

      formData.append('name', this.categoryForm.get('name')?.value);

      // Enviamos al padre el formData para que él llame al servicio necesario (edit o create)
      this.save.emit(formData);

    }
  }


}
