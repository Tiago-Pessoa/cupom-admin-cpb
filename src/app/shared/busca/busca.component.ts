import { CupomAdmService } from './../../cupom-adm.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Cupom } from 'src/app/cupom-adm/cupom.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss']
})
export class BuscaComponent implements OnInit {
   value = '';
  cupons$!: Observable<Cupom[]>;

  private searchTerm = new Subject<string>();
  @Output() private selected = new EventEmitter<Cupom>();

  constructor(private cupomAdmService: CupomAdmService) { }

  ngOnInit(): void {
    this.cupons$ = this.searchTerm.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap((term) => this.cupomAdmService.search(term))
      );

  }

  onSelected(selectedItem: MatAutocompleteSelectedEvent): void {
    this.searchTerm.next('');
    const cupom: Cupom = selectedItem.option.value;
    this.selected.emit(cupom);
  }

  search(term: string): void {
    this.searchTerm.next(term);
    
  }

   limpar(){

      document.getElementById('limpar')?.focus?.()

    this.searchTerm.next('');
   }

   foco(): void {
    document.getElementById('limpar')?.focus?.()
   }

}
