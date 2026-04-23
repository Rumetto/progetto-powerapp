import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../product.service';

@Component({
  selector: 'app-dettaglio-prodotto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dettaglio-prodotto.html',
  styleUrl: './dettaglio-prodotto.css'
})
export class DettaglioProdotto implements OnInit {
  prodotto: Product | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('DETTAGLIO INIT');

    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID ROUTE:', id);

    if (!id) {
      this.errorMessage = 'ID prodotto non valido.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.prodotto = await this.productService.getProductById(id);
      console.log('PRODOTTO DETTAGLIO:', this.prodotto);

      if (!this.prodotto) {
        this.errorMessage = 'Prodotto non trovato.';
      }
    } catch (error) {
      console.error('Errore durante il caricamento del prodotto:', error);
      this.errorMessage = 'Errore durante il caricamento del prodotto.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log('DETTAGLIO LOADING FINITO');
    }
  }

  tornaIndietro() {
    this.location.back();
  }
}