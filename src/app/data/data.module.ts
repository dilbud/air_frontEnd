import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from './material/mat.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatModule,
  ],
  exports: [
    CommonModule,
    MatModule,
  ]
})
export class DataModule { }
