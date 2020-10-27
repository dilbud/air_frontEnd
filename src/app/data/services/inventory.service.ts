import { Injectable } from '@angular/core';
import { QuaryData } from '../models/QuaryData';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = environment.baseUrl + 'dashboard';

  constructor(private http: HttpClient) { }

  private quary(quary: QuaryData, special = false): string {

    const brandCtrl =
      quary.brandCtrl.length !== 0
        ? quary.brandCtrl.reduce((pr, cv, i, arr) => {
          if (arr.length === 1) {
            return pr + cv;
          } else {
            return pr + ',' + cv;
          }
        })
        : 'any';

    const typeCtrl =
      quary.typeCtrl.length !== 0
        ? quary.typeCtrl.reduce((pr, cv, i, arr) => {
          if (arr.length === 1) {
            return pr + cv;
          } else {
            return pr + ',' + cv;
          }
        })
        : 'any';


    let textCtrl: string;

    if (!special) {
      textCtrl = quary.textCtrl
        ? quary.textCtrl
          .trim()
          .toLowerCase()
          .split(' ')
          .filter((v) => {
            return v !== ' ';
          })
          .reduce((pr, cv, i, arr) => {
            if (cv === '') { return pr; }
            if (arr.length === 1) {
              return pr + cv;
            } else {
              return pr + ',' + cv;
            }
          })
        : 'any';
    } else {
      textCtrl = quary.textCtrl
        ? quary.textCtrl.trim().toLowerCase()
        : 'any';
    }

    const search1 = `?brandCtrl=${brandCtrl}`;
    const search2 = `&typeCtrl=${typeCtrl}`;
    const search3 = `&textCtrl=${textCtrl === '' ? 'any' : textCtrl}`;

    const page1 = `&length=${quary.length}`;
    const page2 = `&pageIndex=${quary.pageIndex}`;
    const page3 = `&pageSize=${quary.pageSize}`;
    const page4 = `&previousPageIndex=${quary.previousPageIndex}`;

    const search = search1 + search2 + search3;
    const page = page1 + page2 + page3 + page4;

    const param = `${search}${page}`;
    return param;
  }

  public deleteInventory(id: number, quary: QuaryData) {

    // console.log(this.apiUrl + `/inventories/${id}${param}`);
    return this.http.delete(this.apiUrl + `/inventories/${id}`);
  }

  public getQuaryResult(quary: QuaryData, special = false): Observable<any> {

    const param = this.quary(quary, special);
    // console.log(this.apiUrl + `/inventories${param}`);
    return this.http.get(this.apiUrl + `/inventories${param}`);
  }
}
