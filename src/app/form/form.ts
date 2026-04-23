import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../prodotto/product.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form {
  isLoading = signal(false);
  showSuccess = signal(false);

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required)
  });

  constructor(private productService: ProductService) {}

  async invia() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      await this.productService.addProduct({
        title: this.form.value.title ?? '',
        price: Number(this.form.value.price ?? 0),
        description: this.form.value.description ?? '',
        category: this.form.value.category ?? '',
        image: this.form.value.image ?? '',
        rating: {
          rate: 0,
          count: 0
        }
      });

      this.form.reset();
      this.showSuccess.set(true);

      setTimeout(() => {
        this.showSuccess.set(false);
      }, 2000);

    } catch (error) {
      console.error('Errore salvataggio prodotto:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}