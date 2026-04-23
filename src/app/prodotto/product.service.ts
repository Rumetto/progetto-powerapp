import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Product {
  id?: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection = collection(db, 'products');

  async getProducts(): Promise<Product[]> {
    console.log('ENTRO IN getProducts');

    const snapshot = await getDocs(this.productsCollection);

    console.log('SNAPSHOT ARRIVATO');
    console.log('NUMERO DOCUMENTI:', snapshot.docs.length);

    const prodotti = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Product, 'id'>)
    }));

    console.log('PRODOTTI LETTI:', prodotti);

    return prodotti;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<void> {
    console.log('ADD PRODUCT CHIAMATO CON:', product);
    await addDoc(this.productsCollection, product);
    console.log('PRODOTTO AGGIUNTO SU FIRESTORE');
  }

  async getProductById(id: string): Promise<Product | null> {
    console.log('CERCO PRODOTTO CON ID:', id);

    const productRef = doc(db, 'products', id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      console.log('PRODOTTO NON TROVATO');
      return null;
    }

    const prodotto = {
      id: snapshot.id,
      ...(snapshot.data() as Omit<Product, 'id'>)
    };

    console.log('PRODOTTO TROVATO:', prodotto);

    return prodotto;
  }
}