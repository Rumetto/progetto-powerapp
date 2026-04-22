import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Prodotto } from '../prodotto';

@Component({
  selector: 'app-dettaglio-prodotto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dettaglio-prodotto.html',
  styleUrl: './dettaglio-prodotto.css'
})
export class DettaglioProdotto implements OnInit {
  prodotto = signal<Prodotto | undefined>(undefined);
  id: number = 0;
  errore = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);

    var data = await this.productService.getProdottoById(this.id);
    this.prodotto.set(data);
    console.log("prodotto", this.prodotto());
  }
}