
import { Routes } from '@angular/router';
import { DettaglioProdotto } from './dettaglio-prodotto/dettaglio-prodotto';
import { EditProduct } from './edit-product/edit-product';
import { ProductList } from './product-list/product-list';


export const productRoutes: Routes = [
  
    
      {
        path: '',
        component: ProductList
      },
      {
        path: ':id',
        component: EditProduct
      },
  
];