import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { DialogData } from './../dialog-data.model';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { CupomAdmService } from '../cupom-adm.service';
import { Cupom } from '../cupom-adm/cupom.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cupom-edicao',
  templateUrl: './cupom-edicao.component.html',
  styleUrls: ['./cupom-edicao.component.scss'],
})
export class CupomEdicaoComponent implements OnInit {
  disableSelect = new FormControl(false);
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  options = this._formBuilder.group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });

  cupom!: Cupom;
  isEditing!: boolean;

  selecionadoV: string = '';
  tipoValor: string[]  = [
    'Porcentagem','Valor Fixo','Brinde'
  ];


  // tipoValor:Tipo[] = [
  //   {value: 'porcentagem', viewValue: 'Porcentagem'},
  //   {value: 'valorFixo', viewValue: 'Valor Fixo'},
  //   {value: 'brinde', viewValue: 'Brinde'},
  // ];
 
   
  



  tipoCupom: string[] = ['Grupo', 'Único'];
  selecionadoC: string = '';

  constructor(
    private cupomAdmService: CupomAdmService,
    private _formBuilder: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.getCupom();
  }

  getCupom(): void {


    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId === 'new') {
      this.isEditing = false;
      this.cupom = {cupom: '' } as Cupom
    }else{
      this.isEditing = true;
      this.cupom = {cupom: '' } as Cupom
      const id = Number(paramId);
      this.cupomAdmService
        .getCupom(id)
        .subscribe((cupom) => {(this.cupom = cupom);
        });
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  goBack(): void {
    this.location.back();
  }

  // isFormValid(): boolean {
  //   return !!this.cupom.cupom.trim();
  // }

  create(): void {
    this.cupomAdmService.create(this.cupom).subscribe((cupom) => this.goBack());
  }

  update(): void {
    this.cupomAdmService.update(this.cupom).subscribe((cupom) => this.goBack());
  }

  delete(cupom: Cupom): void {
    const dialogData: DialogData = {
    cancelText: 'Cancelar',
    confirmText: 'Deletar',
    content: `Deseja realmente DELETAR o Cupom "${cupom.cupom}" ?`
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
     data: dialogData,
      width:'15rem',
      
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        this.cupomAdmService.delete(cupom).subscribe(() => {
        this.goBack();
        });

      }
    })

  }
  
}
