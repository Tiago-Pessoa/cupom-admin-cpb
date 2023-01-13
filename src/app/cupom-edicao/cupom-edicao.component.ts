import { PRODUTOS } from './mock-produtos';
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

  produtos = PRODUTOS;

  cupom!: Cupom;
  isEditing!: boolean;

  selecionadoV: string = '';
  tipoValor: string[]  = [
    'Porcentagem','Valor Fixo','Brinde'
  ];

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
    };
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  goBack(): void {
    this.location.back();
  }



  create(): void {

    this.cupomAdmService.create(this.cupom).subscribe((cupom) => this.goBack());
  }

  update(): void {
    this.cupomAdmService.update(this.cupom).subscribe((cupom) => this.goBack());
  }

  cadastrar(): void {
    let inputCodigo = (document.getElementById("cadastroProduto") as HTMLInputElement)
    let codigo  = parseInt(inputCodigo?.value)
    const produtos = PRODUTOS;
    let status = false;
    produtos.map((item) =>{
      if (item.cod === codigo) {
            if (this.cupom.produtos) {
              inputCodigo.value = '';
              status = true;
            return this.cupom.produtos.push(item);
            }else {
               inputCodigo.value = '';
               status = true;
            return this.cupom.produtos = [item];
            }
          }
        });
        if (!status) {
          inputCodigo.value = '';
          alert(`Produto Não pertence ao cupom ${this.cupom.cupom}`)
        }




    // for (let i = 0; i < produtos.length; i++) {
    //   const item = produtos[i];
    //   if (item.cod ===  codigo) {
    //     if (this.cupom.produtos) {
    //     this.cupom.produtos.push(item);
    //     }else {
    //     this.cupom.produtos = [item];
    //     }
    //   }else{
    //   console.log("item não encontrado");
    //   }
    // }




  }

  deletarProduto(): void {
     
    console.log('fui clicado')

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
      };
    });
  };
}
