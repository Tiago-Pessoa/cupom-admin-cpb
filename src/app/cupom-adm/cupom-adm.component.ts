import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CupomAdmService } from '../cupom-adm.service';
import { DialogData } from '../dialog-data.model';
import { Cupom } from './cupom.model';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';


@Component({
  selector: 'app-cupom-adm',
  templateUrl: './cupom-adm.component.html',
  styleUrls: ['./cupom-adm.component.scss'],
})
export class CupomAdmComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'cupom',
    'dataI',
    'dataF',
    'tipo',
    'valor',
    'ativo',
  ];
  cupons: Cupom[] = [];

  value = '';


  constructor(private cupomAdmService: CupomAdmService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getCupons();

  }

  getCupons(): void {
    this.cupomAdmService
      .getCupons()
      .subscribe((cupons) => (this.cupons = cupons));
  }

  onSelected(cupom: Cupom): void {
    this.router.navigate(['/cuponsAdm', cupom.id]);
  }

  changeStatus(cupom: Cupom): void {
    const dialogData: DialogData = {
    cancelText: 'Cancelar',
    confirmText: 'Alterar',
    content: `Deseja realmente ALTERAR o status do Cupom "${cupom.cupom}" ?`
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
     data: dialogData,
      width:'20rem',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        if (cupom.ativo) {
          this.cupomAdmService.update(cupom).subscribe((cupom) => cupom.ativo = true );
        }else{
          this.cupomAdmService.update(cupom).subscribe((cupom) =>  cupom.ativo = false );
        }
      }else{
        if (cupom.ativo) {
          cupom.ativo = false;
        }else{
          cupom.ativo = true;
        };
      };
    });
  };

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;






    if (target.value.length > 0) {
      this.cupons = this.cupons.filter((cupom) => cupom.cupom.toLowerCase().includes(value.toLowerCase()));
      if (this.cupons.length === 0) {
        alert(`Nenhum Cupom Encontrado com o termo: "${target.value}", tente OUTRO nome para encontrar um Cupom existente!`)
        target.value = '';
        this.getCupons();
      }
    }else {
      this.getCupons();
    }

   
  }

  limpar(){
    document.getElementById('buscar')?.focus?.()
    this.getCupons();

 }

 foco(): void {
  document.getElementById('buscar')?.focus?.()
 }


}
