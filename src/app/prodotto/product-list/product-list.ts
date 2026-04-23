import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: Product[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('PRODUCT LIST INIT');

    try {
      this.products = await this.productService.getProducts();
      console.log('PRODUCTS CARICATI:', this.products);
    } catch (error) {
      console.error('Errore durante il caricamento dei prodotti:', error);
      this.errorMessage = 'Errore durante il caricamento dei prodotti.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log('LOADING FINITO');
    }
  }
}