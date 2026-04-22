import { Routes } from '@angular/router';
import { ProductList } from './prodotto/product-list/product-list';
import { DettaglioProdotto } from './prodotto/dettaglio-prodotto/dettaglio-prodotto';
import { Form} from './form/form';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: DettaglioProdotto },
  { path: 'form', component: Form }
];