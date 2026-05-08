import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  QueryConstraint,
  orderBy,
  setDoc,
  OrderByDirection,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  getCountFromServer
} from '@angular/fire/firestore';

import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  nameCollection: string = 'products';

  private firestore: Firestore = inject(Firestore);

  async getProducts(
    categoryId?: string,
    orderField: string = 'title',
    orderDirection: OrderByDirection = 'asc',
    pageSize: number = 5,
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<{
    products: Product[],
    lastDoc: QueryDocumentSnapshot<DocumentData> | null
  }> {
    const filters: QueryConstraint[] = [];

    if (categoryId) {
      filters.push(where('categoryId', '==', categoryId));
    }

    filters.push(orderBy(orderField, orderDirection));

    if (lastDoc) {
      filters.push(startAfter(lastDoc));
    }

    filters.push(limit(pageSize));

    const q = query(
      collection(this.firestore, this.nameCollection),
      ...filters
    );

    const snapshot = await getDocs(q);

    const products = snapshot.docs.map(document => {
      return new Product(document.data());
    });

    const newLastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1]
        : null;

    return {
      products,
      lastDoc: newLastDoc
    };
  }

  async getProductsCount(categoryId?: string): Promise<number> {
    const filters: QueryConstraint[] = [];

    if (categoryId) {
      filters.push(where('categoryId', '==', categoryId));
    }

    const q = query(
      collection(this.firestore, this.nameCollection),
      ...filters
    );

    const snapshot = await getCountFromServer(q);

    return snapshot.data().count;
  }

  async getProductById(id: string): Promise<Product | null> {
    const productRef = doc(this.firestore, `${this.nameCollection}/${id}`);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return null;
    }

    return new Product(snapshot.data());
  }

  async createProduct(product: Product): Promise<void> {
    const id = doc(collection(this.firestore, this.nameCollection)).id;
    product.id = id;

    const docRef = doc(this.firestore, `${this.nameCollection}/${id}`);
    await setDoc(docRef, product.getData());
  }

  async updateProduct(product: Product): Promise<void> {
    const productRef = doc(this.firestore, `${this.nameCollection}/${product.id}`);
    await updateDoc(productRef, product.getData());
  }

  async deleteProduct(id: string): Promise<void> {
    const productRef = doc(this.firestore, `${this.nameCollection}/${id}`);
    await deleteDoc(productRef);
  }
}