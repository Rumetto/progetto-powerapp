import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../product.service';
import { Product } from '../product';
import { CategoryService } from '../../categorie/category.service';

@Component({
  selector: 'app-dettaglio-prodotto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dettaglio-prodotto.html',
  styleUrl: './dettaglio-prodotto.css'
})
export class DettaglioProdotto implements OnInit {
  prodotto: Product | null = null;

  isLoading = signal(true);
  errorMessage = signal('');
  categoryName = signal('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('ID prodotto non valido.');
      this.isLoading.set(false);
      return;
    }

    try {
      this.prodotto = await this.productService.getProductById(id);

      if (!this.prodotto) {
        this.errorMessage.set('Prodotto non trovato.');
        return;
      }

      const categoryId = this.prodotto.categoryId;

      if (categoryId) {
        const category = await this.categoryService.getCategoryById(categoryId);

        if (category) {
          this.categoryName.set(category.name ?? 'Categoria senza nome');
        } else {
          this.categoryName.set('Categoria non trovata');
        }
      } else {
        this.categoryName.set('Categoria non assegnata');
      }

    } catch (error) {
      console.error('Errore durante il caricamento del prodotto:', error);
      this.errorMessage.set('Errore durante il caricamento del prodotto.');
    } finally {
      this.isLoading.set(false);
    }
  }

  tornaIndietro(): void {
    this.location.back();
  }
}