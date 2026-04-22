import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { DettaglioProdotto } from './dettaglio-prodotto/dettaglio-prodotto';

const routes: Routes = [
  { path: '', component: ProductList },
  { path: ':id', component: DettaglioProdotto }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdottoRoutingModule { }
