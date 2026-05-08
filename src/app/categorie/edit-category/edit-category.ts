import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css'
})
export class EditCategory implements OnInit {
  categoryId = '';
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  isCreateMode = signal(false);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('categoryId');

    if (!id) {
      this.errorMessage.set('Categoria non trovata.');
      this.isLoading.set(false);
      return;
    }

    this.categoryId = id;
    this.isCreateMode.set(id === '0');

    if (!this.isCreateMode()) {
      try {
        const category = await this.categoryService.getCategoryById(id);

        if (!category) {
          this.errorMessage.set('Categoria non trovata.');
          this.isLoading.set(false);
          return;
        }

        this.form.patchValue({
          name: category.name
        });
      } catch (error) {
        console.error(error);
        this.errorMessage.set('Errore durante caricamento categoria.');
      }
    }

    this.isLoading.set(false);
  }

  async saveCategory(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.value.name;

    if (!name) return;

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const category = new Category();
      category.name = name;

      if (this.isCreateMode()) {
        await this.categoryService.createCategory(category);
      } else {
        category.id = this.categoryId;
        await this.categoryService.updateCategory(category);
      }

      this.router.navigate(['/categories']);
    } catch (error) {
      console.error(error);
      this.errorMessage.set('Errore durante salvataggio categoria.');
    } finally {
      this.isSaving.set(false);
    }
  }
}