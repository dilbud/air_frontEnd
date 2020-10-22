import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { InventoryData } from 'src/app/data/models/InventoryData';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() items: InventoryData [];
  @Output() deleteInventoryEvent = new EventEmitter<InventoryData>();

  constructor() { }

  ngOnInit() {
  }

  deleteInventory(item: InventoryData) {
    this.deleteInventoryEvent.emit(item);
  }

}
