import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CupomAdmComponent } from './cupom-adm/cupom-adm.component';
import { CupomEdicaoComponent } from './cupom-edicao/cupom-edicao.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/cuponsAdm',
    pathMatch: 'full',
  },
  {
    path: 'cuponsAdm',
    component: CupomAdmComponent,
  },
  {
    path: 'cuponsAdm/:id',
    component: CupomEdicaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
