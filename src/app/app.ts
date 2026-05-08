import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private router: Router) { }

  isProductsActive(): boolean {
    return this.router.url.startsWith('/products');
  }

  isCategoriesActive(): boolean {
    return this.router.url.startsWith('/categories');
  }
}