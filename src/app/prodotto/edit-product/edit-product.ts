import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Category } from '../../categorie/category';
import { CategoryService } from '../../categorie/category.service';
import { Product } from '../product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {

  productId = '';
  categories: Category[] = [];

  isCreateMode = false;

  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    image: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '0';

    this.isCreateMode = this.productId === '0';

    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.categories = await this.categoryService.getCategories();

      if (!this.isCreateMode) {
        const product = await this.productService.getProductById(this.productId);

        if (!product) {
          this.errorMessage = 'Prodotto non trovato.';
          return;
        }

        this.form.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          categoryId: product.categoryId
        });
      }

    } catch (error) {
      console.error('Errore caricamento dati:', error);
      this.errorMessage = 'Errore durante il caricamento dei dati.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async saveProduct(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';


    var product = new Product();
    product.title = this.form.value.title ?? "";
    product.price = Number(this.form.value.price);
    product.description = this.form.value.description ?? "";
    product.image = this.form.value.image ?? "";
    product.categoryId = this.form.value.categoryId ?? "";

    try {
      if (this.isCreateMode) {
        await this.productService.createProduct(product);
        this.successMessage = 'Prodotto creato correttamente.';
      } else {
        await this.productService.updateProduct(product);
        this.successMessage = 'Prodotto modificato correttamente.';
      }

      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 1000);

    } catch (error) {
      console.error('Errore salvataggio prodotto:', error);
      this.errorMessage = 'Errore durante il salvataggio del prodotto.';
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }
}