import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Brand} from 'src/app/data/models/Brand';
import {InventoryData} from 'src/app/data/models/InventoryData';
import {Type} from 'src/app/data/models/Type';

interface DialogData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss']
})
export class AddInventoryComponent implements OnInit, OnDestroy {

  inventory: FormGroup;
  lock = true; // disable on destroy

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
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  ngOnInit() {
    this.inventory = this.formBuilder.group({
      brand: [{value: '', disabled: false}, [Validators.required]],
      type: [{value: '', disabled: false}, [Validators.required]],
      description: ['', [Validators.required]],
      price: [{value: '', disabled: false}, [Validators.required]],
      expire: [{value: new Date(), disabled: false}, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    // disable on destroy
    if (this.lock) {
      this.dialogRef.close('close');
    }
  }

  submit() {
    if (this.inventory.valid) {
      this.lock = false;
      const date: Date = this.inventory.value.expire;
      const item: InventoryData = {
        id: null,
        brand: this.inventory.value.brand,
        type: this.inventory.value.type,
        description: this.inventory.value.description,
        price: this.inventory.value.price,
        expire: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      };
      this.dialogRef.close(item);
    } else {
      this.lock = false;
    }
  }

  close() {
    this.lock = false;
    this.dialogRef.close('close');
  }
}
