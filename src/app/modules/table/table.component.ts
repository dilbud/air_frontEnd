import { PageData } from 'src/app/data/models/PageData';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { InventoryData } from 'src/app/data/models/InventoryData';

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
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableComponent implements OnInit, OnChanges{

  @Input() items: InventoryData [] = [];
  @Input() paginator: MatPaginator;
  @Input() pageData: PageData;

  @Output() deleteInventoryEvent = new EventEmitter<InventoryData>();
  @Output() updateInventoryEvent = new EventEmitter<InventoryData>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
        this.inventory = this.formBuilder.group({
          Ctrl_1: ['', [Validators.required]],
          Ctrl_2: ['', [Validators.required]],
          Ctrl_3: ['', [Validators.required]],
          Ctrl_4: ['', [Validators.required, Validators.email]],
          Ctrl_5: ['', [Validators.required]],
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

  setForm(row: any) {
    // this.inventory.setValue({
    //   Ctrl_1: row.firstName,
    //   Ctrl_2: row.lastName,
    //   Ctrl_3: row.nic,
    //   Ctrl_4: row.email,
    //   Ctrl_5: row.id,
    // });
    // this.inventory.disable();
  }

  deleteInventory(item: InventoryData) {
    this.deleteInventoryEvent.emit(item);
  }

  updateInventory(item: InventoryData) {
    this.updateInventoryEvent.emit(item);
  }

}
