import {PageData} from 'src/app/data/models/PageData';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {InventoryData} from 'src/app/data/models/InventoryData';
import {Brand} from 'src/app/data/models/Brand';
import {Type} from 'src/app/data/models/Type';

export interface RowData {
  no: string;
  brand: string;
  type: string;
  description: string;
  price: string;
  expire: string;
  row: any;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableComponent implements OnInit, OnChanges {

  @Input() items: InventoryData [] = [];
  @Input() paginator: MatPaginator;
  @Input() pageData: PageData;

  @Output() deleteInventoryEvent = new EventEmitter<InventoryData>();
  @Output() updateInventoryEvent = new EventEmitter<InventoryData>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<RowData>;
  columnsToDisplay = [
    'no',
    'brand',
    'type',
    'description',
    'price',
    'expire',
  ];

  expandedElement: RowData | null;
  inventory: FormGroup;
  allAppTable: RowData[] = [];

  brands: Brand[] = [
    {value: 'samsung', viewValue: 'Samsung'},
    {value: 'lg', viewValue: 'LG'},
    {value: 'singer', viewValue: 'Singer'},
    {value: 'philips', viewValue: 'Philips'},
  ];

  types: Type[] = [
    {value: 'tv', viewValue: 'TV'},
    {value: 'refrigerator', viewValue: 'Refrigerator'},
    {value: 'radio', viewValue: 'Radio'},
    {value: 'laptop', viewValue: 'Laptop'},
  ];

  public myFilter = (d: Date | null): boolean => {
    const day = d || new Date();
    const today = new Date();

    const slectMili = new Date(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate()
    ).getTime();
    const todatMili = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    ).getTime();
    return slectMili >= todatMili;
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.inventory = this.formBuilder.group({
      brand: [{value: '', disabled: false}, [Validators.required]],
      type: [{value: '', disabled: false}, [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      expire: [{value: new Date(), disabled: false}, [Validators.required]],
    });
    this.createTableRow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.createTableRow();
    }
  }

  private createTableRow() {
    this.allAppTable = [];
    this.items.forEach((val: InventoryData, index) => {
      const single: RowData = {
        no: (index + 1 + this.pageData.pageIndex * 6).toString(),
        brand: val.brand,
        type: val.type,
        description: val.description,
        price: val.price,
        expire: val.expire,
        row: val,
      };
      this.allAppTable.push(single);
    });

    this.dataSource = new MatTableDataSource(this.allAppTable);
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setForm(item: InventoryData) {
    const d = new Date();
    const dArray = item.expire.split('-');
    const yyyy = +dArray[0];
    const mm = +dArray[1];
    const dd = +dArray[2];
    d.setFullYear(yyyy, mm - 1, dd);
    this.inventory.setValue({
      brand: item.brand,
      type: item.type,
      description: item.description,
      price: item.price,
      expire: d,
    });
    this.inventory.disable();
  }

  resetForm(item: InventoryData) {
    const d = new Date();
    const dArray = item.expire.split('-');
    const yyyy = +dArray[0];
    const mm = +dArray[1];
    const dd = +dArray[2];
    d.setFullYear(yyyy, mm - 1, dd);
    this.inventory.setValue({
      brand: item.brand,
      type: item.type,
      description: item.description,
      price: item.price,
      expire: d,
    });
  }

  deleteInventory(item: InventoryData) {
    this.deleteInventoryEvent.emit(item);
  }

  updateInventory(item: InventoryData) {
    if (this.inventory.valid) {
      const date: Date = this.inventory.value.expire;
      const newItem = {
        ...item,
        brand: this.inventory.value.brand,
        type: this.inventory.value.type,
        description: this.inventory.value.description,
        price: this.inventory.value.price,
        expire: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      }
      this.updateInventoryEvent.emit(newItem);
    }
  }
}
