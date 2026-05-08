import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  QueryConstraint,
  orderBy,
  OrderByDirection,
  query,
  setDoc,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  getCountFromServer
} from '@angular/fire/firestore';

import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  nameCollection: string = 'categories';

  private firestore: Firestore = inject(Firestore);

  async getCategories(
    orderField?: string,
    orderDirection?: OrderByDirection,
    pageSize?: number
  ): Promise<Category[]> {
    const filters: QueryConstraint[] = [];

    if (orderField) {
      filters.push(orderBy(orderField, orderDirection));
    }

    if (pageSize) {
      filters.push(limit(pageSize));
    }

    const q = query(
      collection(this.firestore, this.nameCollection),
      ...filters
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(document => {
      return new Category(document.data());
    });
  }

  async getCategoriesPage(
    orderField: string = 'name',
    orderDirection: OrderByDirection = 'asc',
    pageSize: number = 5,
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<{
    categories: Category[],
    lastDoc: QueryDocumentSnapshot<DocumentData> | null
  }> {
    const filters: QueryConstraint[] = [];

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

    const categories = snapshot.docs.map(document => {
      return new Category(document.data());
    });

    const newLastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1]
        : null;

    return {
      categories,
      lastDoc: newLastDoc
    };
  }

  async getCategoriesCount(): Promise<number> {
    const q = query(
      collection(this.firestore, this.nameCollection)
    );

    const snapshot = await getCountFromServer(q);

    return snapshot.data().count;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const categoryRef = doc(this.firestore, `${this.nameCollection}/${id}`);
    const snapshot = await getDoc(categoryRef);

    if (!snapshot.exists()) {
      return null;
    }

    return new Category(snapshot.data());
  }

  async createCategory(category: Category): Promise<void> {
    const id = doc(collection(this.firestore, this.nameCollection)).id;
    category.id = id;

    const docRef = doc(this.firestore, `${this.nameCollection}/${id}`);
    await setDoc(docRef, category.getData());
  }

  async updateCategory(category: Category): Promise<void> {
    const categoryRef = doc(this.firestore, `${this.nameCollection}/${category.id}`);
    await updateDoc(categoryRef, category.getData());
  }

  async deleteCategory(id: string): Promise<void> {
    const categoryRef = doc(this.firestore, `${this.nameCollection}/${id}`);
    await deleteDoc(categoryRef);
  }
}