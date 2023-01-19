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
  cupons$!: Observable<Cupom[]>;

  private searchTerm = new Subject<string>();
  @Output() private select = new EventEmitter<Cupom>();

  constructor(private cupomAdmService: CupomAdmService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.getCupons();
    this.cupons$ = this.searchTerm.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((term) => this.cupomAdmService.search(term))
    );
  }

  onSelect(selectedItem: MatAutocompleteSelectedEvent): void {
    this.searchTerm.next('');
    const cupom: Cupom = selectedItem.option.value;
    this.select.emit(cupom);
  }

  search(term: string): void {
    this.searchTerm.next(term);
    
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

  foco(): void {
    document.getElementById('buscar')?.focus?.()
   }

   limpar(){

    document.getElementById('limpar')?.focus?.()

  this.searchTerm.next('');
 }


}
