import { InventoryData } from './../../data/models/InventoryData';
import { UserData } from './../../data/models/userData';
import { SuccessMsgData } from './../../data/models/SuccessMsgData';
import { QuaryData } from './../../data/models/QuaryData';
import { InventoryService } from './../../data/services/inventory.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatPaginator, MatSnackBar } from '@angular/material';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { PageData } from 'src/app/data/models/PageData';

interface Brand {
  value: string;
  viewValue: string;
}
interface Type {
  value: string;
  viewValue: string;
}

interface SearchData {
  brandCtrl: string[];
  textCtrl: string;
  typeCtrl: string[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  search: FormGroup;
  totalLength = 0;
  pageData: PageData;
  previousSearch: SearchData;
  clear = true;

  results: InventoryData[] = [];

  brands: Brand[] = [
    { value: 'any', viewValue: 'Any' },
    { value: 'samsung', viewValue: 'Samsung' },
    { value: 'lg', viewValue: 'LG' },
    { value: 'singer', viewValue: 'Singer' },
    { value: 'philips', viewValue: 'Philips' },
  ];

  types: Type[] = [
    { value: 'any', viewValue: 'Any' },
    { value: 'tv', viewValue: 'TV' },
    { value: 'refrigerator', viewValue: 'Refrigerator' },
    { value: 'radio', viewValue: 'Radio' },
    { value: 'laptop', viewValue: 'Laptop' },
  ];

  pageSizeOptions = [6, 9, 27, 99];

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private inventoryService: InventoryService,
  ) { }

  ngOnInit() {

    this.pageData = {
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: 6,
      length: 0
    };

    this.search = this.formBuilder.group({
      textCtrl: [],
      brandCtrl: [{ value: ['any'], disabled: false }],
      typeCtrl: [{ value: ['any'], disabled: false }],
    });

    this.getResult();
  }

  ngAfterViewInit() {

    this.paginator.page.subscribe((v: PageData) => {
      this.pageData = v;
      this.getResult();
    });

    this.previousSearch = this.search.value;

    this.search.valueChanges.pipe(debounceTime(100)).subscribe((val: SearchData) => {
      this.getResult();
      this.previousSearch = val;
    });

    this.search.get('brandCtrl').valueChanges.subscribe((val: string[]) => {
      if (_.isEqual(this.previousSearch.brandCtrl, val) === false) {
        if (val.length === 0 || val.length === this.brands.length) {
          this.search.get('brandCtrl').setValue(['any']);
        }
        if (val[0] !== 'any' && val.length === 4) {
          this.search.get('brandCtrl').setValue(['any']);
        }
        if (val[0] === 'any' && val.length >= 2 && val.length <= 4) {
          this.search.get('brandCtrl').setValue(val.slice(1));
        }
        if (this.previousSearch.brandCtrl[0] !== 'any' && val[0] === 'any') {
          this.previousSearch.brandCtrl = ['any'];
          this.search.get('brandCtrl').setValue(['any']);
        }
      }
    });

    this.search.get('typeCtrl').valueChanges.subscribe((val: string[]) => {
      if (_.isEqual(this.previousSearch.brandCtrl, val) === false) {
        if (val.length === 0 || val.length === this.brands.length) {
          this.search.get('typeCtrl').setValue(['any']);
        }
        if (val[0] !== 'any' && val.length === 4) {
          this.search.get('typeCtrl').setValue(['any']);
        }
        if (val[0] === 'any' && val.length >= 2 && val.length <= 4) {
          this.search.get('typeCtrl').setValue(val.slice(1));
        }
        if (this.previousSearch.typeCtrl[0] !== 'any' && val[0] === 'any') {
          this.previousSearch.typeCtrl = ['any'];
          this.search.get('typeCtrl').setValue(['any']);
        }
      }
    });
  }

  deleteInventory(item: InventoryData) {
    const quary: QuaryData = {
      ...this.pageData,
      ...this.search.value
    };
    this.inventoryService.deleteInventory(item.id, quary).subscribe((res: any) => {
    }, (err: any) => {
      this.matSnackBar.open('Not Deleted', 'OK', { duration: 1200 });
      this.getResult();
    }, () => {
      this.matSnackBar.open('Item Delete Success', 'OK', { duration: 1200 });
      this.getResult();
    });
  }

  updateInventory(item: InventoryData) {
    // const quary: QuaryData = {
    //   ...this.pageData,
    //   ...this.search.value
    // };
    // this.inventoryService.deleteInventory(item.id, quary).subscribe((res: any) => {
    // }, (err: any) => {
    //   this.matSnackBar.open('Not Deleted', 'OK', { duration: 1200 });
    //   this.getResult();
    // }, () => {
    //   this.matSnackBar.open('Item Delete Success', 'OK', { duration: 1200 });
    //   this.getResult();
    // });
  }

  getResult(special = false) {
    const quary: QuaryData = {
      ...this.pageData,
      ...this.search.value
    };
    this.inventoryService.getQuaryResult(quary, special).pipe(debounceTime(500)).subscribe((res: SuccessMsgData) => {
      this.totalLength = res.page.length;
      const val = res.data as InventoryData[];
      this.results = val;
      console.log(this.results);

    }, (err: any) => {
      this.results = [];
      this.matSnackBar.open('No Found Result', 'OK', { duration: 1200 });
      this.totalLength = 0;
    }, () => {
    });
  }

  resetText() {
    this.search.setValue({ ...this.search.value, textCtrl: null }, { onlySelf: true, emitEvent: true });
  }

  searchText() {
    this.getResult();
  }
}
