import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscaComponent } from './busca/busca.component';

const COMPONENTS = [BuscaComponent];


@NgModule({
  declarations: [COMPONENTS],
  imports: [ CommonModule, MaterialModule ],
  exports: [COMPONENTS],
})
export class SharedModule { }
