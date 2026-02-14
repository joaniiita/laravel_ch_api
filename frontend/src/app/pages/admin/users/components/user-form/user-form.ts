import {Component, effect, inject, input, InputSignal, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Category} from '../../../../../models/category';
import {CategoryService} from '../../../../../shared/categories/category';
import {AdminPetitionService} from '../../../../../shared/petitions/admin/admin-petition';
import {AdminUserService} from '../../../../../shared/users/user';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
// El input. se utiliza cuando los datos vienen de fuera del componente
  mode = input.required<'edit' | 'show'>();
  initialData : InputSignal<any> = input<any>(null);

  save = output<any>();

  // El signal si es de dentro
  selectedFile = signal<File | null>(null);
  user = signal<any>({});
  id = signal<number>(0);

  private fb = inject(FormBuilder);
  private adminUserService = inject(AdminUserService);
  private aRouter = inject(ActivatedRoute);

  userForm!: FormGroup;

  constructor() {
    // Esto es para ver si cambia algo que se hagan cambios asíncronos (como un watch en vue)
    effect(() => {
      const data = this.initialData();
      if (data){
        this.userForm.patchValue(data, { emitEvent: false});
      }
    });
  }

  ngOnInit(){
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      is_admin: ['', [Validators.required]],
      password: ['', []],
    });

    if (this.mode() === 'show'){
      this.userForm.disable();
      this.id.set(this.aRouter.snapshot.params['id']);
      this.adminUserService.find(this.id()).subscribe({
        next: (data) => this.user.set(data),
        error: (err) => console.log(err)
      })
    }

  }

  onSubmit(){
    if (this.userForm.valid){
      const formData = new FormData();

      const image = this.selectedFile();

      formData.append('name', this.userForm.get('name')?.value);
      formData.append('email', this.userForm.get('email')?.value);
      formData.append('is_admin', this.userForm.get('is_admin')?.value);
      formData.append('password', this.userForm.get('password')?.value);

      // Si la imagen no es nula lo agregamos al formulario (que sino sale un error de tipado)
      if (image !== null){
        formData.append('image', image, image.name);
      }

      // Enviamos al padre el formData para que él llame al servicio necesario (edit o create)
      this.save.emit(formData);

    }
  }

  onSelectedFile(event: any){
    const input = event?.target as HTMLInputElement;
    if (input.files?.length){
      this.selectedFile.set(input.files[0]);
      console.log(this.selectedFile());
    }
  }

  getImageUrl(image: string){
    return 'http://localhost:8000/assets/images/user/' + image;
  }
}
