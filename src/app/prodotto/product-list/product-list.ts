import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Prodotto } from '../prodotto';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  prodotti = signal<Prodotto[]>([]);

  constructor(private productService: ProductService) { }

  async ngOnInit(): Promise<void> {
    var data = await this.productService.getProdotti();
    this.prodotti.set(data);
    console.log("prodotti", this.prodotti());

    // this.productService.getProdotti().then((data: any[]) => {
    //   this.prodotti.set(data);
    // }).catch((err: any) => {
    //   console.error('ERRORE API DETTAGLIO:', err);
    //  // this.errore.set('Errore nel caricamento del prodotto');
    // });
  }
}