import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  isLoading = signal(false);
  showSuccessScreen = signal(false);

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    messaggio: new FormControl('', Validators.required),
  });

  invia() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);
      this.showSuccessScreen.set(true);

      console.log(this.form.value);

      this.form.reset({
        nome: '',
        cognome: '',
        email: '',
        messaggio: '',
      });

      setTimeout(() => {
        this.showSuccessScreen.set(false);
      }, 3000);
    }, 2000);
  }
}