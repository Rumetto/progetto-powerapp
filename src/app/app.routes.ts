import { Routes } from '@angular/router';

import { CategoryList } from './categorie/category-list/category-list';

import { EditCategory } from './categorie/edit-category/edit-category';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./prodotto/product.routes').then(m => m.productRoutes)
  },

  {
    path: 'categories',
    children: [
      {
        path: '',
        component: CategoryList
      },
      {
        path: ':categoryId',
        component: EditCategory
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'products'
  }
];