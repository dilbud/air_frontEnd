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

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  search: FormGroup;
  totalLength = 0;
  pageData: PageData;
  previousSearch: SearchData;
  clear = true;

  results: InventoryData [] = [];

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
  ) {}

  ngAfterViewInit() {
    this.paginator.page.subscribe((v: PageData) => {
      this.pageData = v;
      this.getResult();
    });


    this.previousSearch  = this.search.value;

    this.search.valueChanges.pipe(debounceTime(100)).subscribe((val: SearchData) => {

      if (_.isEqual(this.previousSearch, val)) {
      } else {
        this.getResult();
        this.previousSearch = val;
      }
    });
  }
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

  deleteInventory(item: InventoryData) {
    const quary: QuaryData = {
      ...this.pageData,
      ...this.search.value
    };
    this.inventoryService.deleteInventory(item.id, quary).pipe().subscribe((res: any) => {
      this.totalLength = res.page.length;
      const val = res.data as InventoryData[];
      this.results = val;
    }, (err: any) => {
      this.matSnackBar.open('Not Deleted', 'OK', { duration: 1200});
      this.getResult();
    }, () => {
      this.matSnackBar.open('Item Delete Success', 'OK', { duration: 1200});
    });
  }

  getResult() {
    const quary: QuaryData = {
      ...this.pageData,
      ...this.search.value
    };
    this.inventoryService.getQuaryResult(quary).pipe(debounceTime(500)).subscribe((res: SuccessMsgData) => {
      this.totalLength = res.page.length;
      const val = res.data as InventoryData[];
      this.results = val;
    }, (err: any) => {
      this.results = [];
      this.matSnackBar.open('No Found Result', 'OK', { duration: 1200});
      this.totalLength = 0;
    }, () => {
    });
  }

  resetText() {
    this.search.setValue({...this.search.value, textCtrl: null}, {onlySelf: true, emitEvent: true});
  }
  applyFilter(event: Event) {
    this.getResult();
  }
}


      // if (
      //   this.val.brandCtrl.find((v: string) => v === 'any') === 'any' &&
      //   this.val.brandCtrl.length > 1
      // ) {
      //   this.search.setValue({
      //     ...this.val,
      //     brandCtrl: this.val.brandCtrl.filter((v: string) => v !== 'any'),
      //   });
      // }
      // if (
      //   this.val.typeCtrl.find((v: string) => v === 'any') === 'any' &&
      //   this.val.typeCtrl.length > 1
      // ) {
      //   this.search.setValue({
      //     ...this.val,
      //     brandCtrl: this.val.typeCtrl.filter((v: string) => v !== 'any'),
      //   });
      // }

        // this.current = this.search.value;

    // this.search.valueChanges.pipe(debounceTime(100)).subscribe((val) => {
    //   if (_.isEqual(val, this.current)) {
    //     console.log('*********************');
    //   } else {
    //     // for brand
    //     if ( !this.current.brandCtrl.find((v: string) => v === 'any') ) {
    //         this.search.setValue({
    //           ...val,
    //           brandCtrl: ['any'],
    //         });

    //     }
    //     if ( this.brands.length === val.brandCtrl.length) {
    //       this.search.setValue({
    //         ...val,
    //         brandCtrl: ['any'],
    //       });
    //     }
    //     // for type
    //     if ( !this.current.typeCtrl.find((v: string) => v === 'any')) {
    //       this.search.setValue({
    //         ...val,
    //         typeCtrl: ['any'],
    //       });

    //     }
    //     if ( this.types.length === val.typeCtrl.length) {
    //       this.search.setValue({
    //         ...val,
    //         typeCtrl: ['any'],
    //       });
    //     }
    //   }
    //   this.current = val;
    // });
            // // for brand ctrl
        // if (val.brandCtrl.findIndex((v) => v === 'any' ) === -1) {
        //     if (val.brandCtrl.length >= 4 || val.brandCtrl.length === 0) {
        //       this.search.setValue({...this.search.value, brandCtrl: ['any']},  {onlySelf: true, emitEvent: false});
        //     }
        // } else {
        //     if (this.previousSearch.brandCtrl.findIndex((v) => v === 'any' ) === -1) {
        //     } else {
        //       if (val.brandCtrl.length < 4) {
        //         this.search.setValue(
        //           {...this.search.value, brandCtrl: val.brandCtrl.filter((vv) =>  vv !== 'any')},
        //           {onlySelf: true, emitEvent: false});
        //       }
        //     }
        // }
        // // for type ctrl
        // if (val.typeCtrl.findIndex((v) => v === 'any' ) === -1) {
        //   if (val.typeCtrl.length >= 4 || val.typeCtrl.length === 0) {
        //     this.search.setValue({...this.search.value, typeCtrl: ['any']}, {onlySelf: true, emitEvent: false});
        //   }

        // } else {
        //     if (this.previousSearch.typeCtrl.findIndex((v) => v === 'any' ) === -1) {
        //     } else {
        //       if (val.typeCtrl.length < 4) {
        //         this.search.setValue(
        //           {...this.search.value, typeCtrl: val.typeCtrl.filter((vv) =>  vv !== 'any')},
        //           {onlySelf: true, emitEvent: false});
        //       }
        //     }
        // }
