import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Category } from '../category';
import { CategoryService } from '../category.service';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import {
  OrderByDirection,
  QueryDocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginatorModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {

  categories = signal<Category[]>([]);

  isLoading = signal(true);
  errorMessage = signal('');

  first: number = 0;
  rows: number = 5;
  totalRecords: number = 0;

  orderField: string = 'name';
  orderDirection: OrderByDirection = 'asc';

  pageCursors: Array<QueryDocumentSnapshot<DocumentData> | null> = [null];

  constructor(private categoryService: CategoryService) {}

  async ngOnInit(): Promise<void> {
    await this.resetAndLoad();
  }

  async resetAndLoad(): Promise<void> {
    this.first = 0;
    this.pageCursors = [null];

    this.totalRecords = await this.categoryService.getCategoriesCount();

    await this.loadPage(0);
  }

  async loadPage(pageIndex: number): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      let cursor = this.pageCursors[pageIndex] ?? null;

      if (pageIndex > 0 && !this.pageCursors[pageIndex]) {
        await this.buildCursorsUntil(pageIndex);
        cursor = this.pageCursors[pageIndex] ?? null;
      }

      const result = await this.categoryService.getCategoriesPage(
        this.orderField,
        this.orderDirection,
        this.rows,
        cursor
      );

      this.categories.set(result.categories);
      this.pageCursors[pageIndex + 1] = result.lastDoc;

    } catch (error) {
      console.error('Errore caricamento categorie:', error);
      this.errorMessage.set('Errore durante il caricamento delle categorie.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async buildCursorsUntil(targetPage: number): Promise<void> {
    this.pageCursors = [null];

    let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

    for (let i = 0; i < targetPage; i++) {
      const result = await this.categoryService.getCategoriesPage(
        this.orderField,
        this.orderDirection,
        this.rows,
        cursor
      );

      cursor = result.lastDoc;
      this.pageCursors[i + 1] = cursor;
    }
  }

  async onPageChange(event: PaginatorState): Promise<void> {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;

    const pageIndex = Math.floor(this.first / this.rows);

    await this.loadPage(pageIndex);
  }

  async onSearch(event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    if (!value) {
      await this.resetAndLoad();
      return;
    }

    const allCategories = await this.categoryService.getCategories(
      this.orderField,
      this.orderDirection
    );

    const filtered = allCategories.filter(category =>
      category.name?.toLowerCase().includes(value)
    );

    this.categories.set(filtered);
    this.totalRecords = filtered.length;
    this.first = 0;
  }

  async deleteCategory(categoryId: string | undefined, event: Event): Promise<void> {
    event.stopPropagation();

    if (!categoryId) return;

    const confirmDelete = confirm('Sei sicuro di voler eliminare questa categoria?');
    if (!confirmDelete) return;

    try {
      await this.categoryService.deleteCategory(categoryId);
      await this.resetAndLoad();
    } catch (error) {
      console.error('Errore eliminazione categoria:', error);
      this.errorMessage.set('Errore durante eliminazione della categoria.');
    }
  }
}