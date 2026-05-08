import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-category.html',
  styleUrl: './create-category.css'
})
export class CreateCategory {

  private categoryService = inject(CategoryService);
  private router = inject(Router);

  isSaving = signal(false);
  errorMessage = signal('');

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });

  async saveCategory(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.controls.name.value.trim();

    if (!name) {
      this.errorMessage.set('Inserisci un nome valido.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const category = new Category();
      category.name = name;

      await this.categoryService.createCategory(category);
      await this.router.navigate(['/categories']);
    } catch (error) {
      console.error(error);
      this.errorMessage.set('Errore durante la creazione della categoria.');
    } finally {
      this.isSaving.set(false);
    }
  }
}