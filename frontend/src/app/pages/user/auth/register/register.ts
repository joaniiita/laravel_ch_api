import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../../shared/auth/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{
  registerForm!: FormGroup;
  error: any = null;

  private fb = inject(FormBuilder)
  private auth = inject(AuthService)
  private router = inject(Router)

  constructor() {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    })
  }

  onSubmit(){
    if (this.registerForm.valid) {
      const formData = new FormData();

      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('password_confirmation', this.registerForm.get('password_confirmation')?.value);

      this.auth.register(formData).subscribe(
        data => {
          this.router.navigate(['/login']);
          console.log(data);
        },
        err => {
          this.error = err.error.message;
        }
      )
    } else {
      this.error = 'Invalid form data';
    }
  }
}
