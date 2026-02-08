import {Component, inject} from '@angular/core';
import {AuthService} from '../../../../shared/auth/auth';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  error : any = null;
  constructor() {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(){
    this.auth.login(this.loginForm.value).subscribe({
      next : () => {
        this.router.navigate(['/']);
      },
      error : (err) => {
        this.error = err.error;
        console.log('Objeto de error capturado:', this.error);
      }
    })
  }
}
