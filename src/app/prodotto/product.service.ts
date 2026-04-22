import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prodotto } from './prodotto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  async getProdotti(): Promise<Prodotto[]> {
    return new Promise((resolve, reject) => {
      this.http.get('https://fakestoreapi.com/products').subscribe((json: any) => {
        //console.log("data", data);
        var prodotti: Prodotto[] = [];
        json.forEach((element: any) => {
          prodotti.push(new Prodotto(element));
        });
        resolve(prodotti);
      });
    });
  }

  async getProdottoById(id: number): Promise<Prodotto> {
    return new Promise((resolve, reject) => {
      this.http.get(`https://fakestoreapi.com/products/${id}`).subscribe((json: any) => {
        //console.log("data", data);
        resolve(new Prodotto(json));
      });
    });
  }
}