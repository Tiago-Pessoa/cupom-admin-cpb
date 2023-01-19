import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cupom } from './cupom-adm/cupom.model';
import { Produto } from './cupom-edicao/produto.model';

@Injectable({
  providedIn: 'root',
})
export class CupomAdmService {

  private cuponsUrl = `${environment.baseUrl}/cupons`;
  private produtosUrl = `${environment.baseUrl}/produtos`;

getCupons(): Observable<Cupom[]> {
  return this.http.get<Cupom[]>(this.cuponsUrl)
}


getCupom(id: number): Observable<Cupom> {
  return this.http.get<Cupom>(`${this.cuponsUrl}/${id}`);
}

search(term: string): Observable<Cupom[]> {
  if(!term.trim()){
    return of([]);
  }
  return this.http.get<Cupom[]>(`${this.cuponsUrl}?cupom=${term}`).pipe(
    tap((cupons)=> cupons.length ? console.log('found coupons') :
    alert("Nenhum Cupom Encontrado com esses termos, tente outro nome para encontrar um Cupom existente!")
    )
    )
  }

  create(cupom: Cupom): Observable<Cupom> {
    return this.http.post<Cupom>(this.cuponsUrl, cupom);
  }

  update(cupom: Cupom): Observable<Cupom> {
    return this.http.put<Cupom>(`${this.cuponsUrl}/${cupom.id}`, cupom)
  }

  delete(cupom: Cupom): Observable<any> {
    return this.http.delete<any>(this.getUrl(cupom.id))
  }

  private getUrl(id: number): string {
    return `${this.cuponsUrl}/${id}`;
  }
  constructor(private http: HttpClient) {}
}
