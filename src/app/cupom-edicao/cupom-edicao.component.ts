import { PRODUTOS } from './mock-produtos';
import { ConfirmationDialogComponent } from './../confirmation-dialog/confirmation-dialog.component';
import { DialogData } from './../dialog-data.model';
import { Location, UpperCasePipe } from '@angular/common';
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
      this.cupomAdmService.getCupom(id).subscribe((cupom) => {(this.cupom = cupom);
      });
    };
  };

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


  recordCoupon(): void {
    let inputCodigo = (document.getElementById("cadastroProduto") as HTMLInputElement)
    let codigo  = parseInt(inputCodigo?.value)
    const produtos = PRODUTOS;
    let status = false;
    let repete: any = [];
    produtos.map((item) =>{
      if (item.cod === codigo) {
        status = true;
        document.getElementById('cadastroProduto')?.focus?.();
        inputCodigo.value = '';
        if (this.cupom.produtos) {
          for (let i = 0; i < this.cupom.produtos.length; i++) {
            if (this.cupom.produtos[i].cod === codigo) {
              repete.push(this.cupom.produtos[i]);
            }
          }
          if (repete.length) {
            for (let i = 0; i < this.cupom.produtos.length; i++) {

              if (this.cupom.produtos[i].cod === codigo) {
                alert(`JÁ EXISTE "${this.cupom.produtos[i].produto}" NO CADASTRO DE PRODUTOS DO CUPOM!`);
              }
            }
          }else{
            alert(`O PRODUTO "${item.produto}" FOI CADASTRADO COM SUCESSO!`)
            return this.cupom.produtos.push(item);
          }
        }else {
          alert(`O PRODUTO "${item.produto}" FOI CADASTRADO COM SUCESSO!`)
          return this.cupom.produtos = [item];
        };
      };
    });
    if (!status) {
      inputCodigo.value = '';
      document.getElementById('cadastroProduto')?.focus?.()
      alert(`Produto Não pertence ao cupom "${this.cupom.cupom}"`)
    };
  };

  deleteProduct(selecionado: any): void {
    const dialogData: DialogData = {
      cancelText: 'Cancelar',
      confirmText: 'Deletar',
      content: `Deseja realmente DELETAR o Produto "${selecionado.produto}" do Cupom "${this.cupom.cupom}" ?`
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
      width:'20rem',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        var myArray = this.cupom.produtos;
        var newArray = myArray.filter((item: any) => item.cod !== selecionado.cod);
        this.cupom.produtos = newArray;
      };
    });
  };

  confirmReturn(): void {
    const dialogData: DialogData = {
      cancelText: 'Cancelar',
      confirmText: 'OK',
      content: `Os Dados NÃO SALVOS do cupom "${this.cupom.cupom}" serão descartados, Deseja PROSSEGUIR mesmo assim?`
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
      width:'20rem',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        this.location.back();
      };
    });
  };

  confirmReturnCadastrar(): void {
    const dialogData: DialogData = {
      cancelText: 'Cancelar',
      confirmText: 'OK',
      content: `Esse Cupom e todas as alterações serão descartadas, Deseja PROSSEGUIR mesmo assim?`
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
      width:'20rem',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        this.location.back();
      };
    });
  };

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

  isValid(): boolean {
    let inputCodigo = (document.getElementById("cadastroProduto") as HTMLInputElement)
    return !!inputCodigo.value.trim();
  };

  isValidAction(): boolean {
    return !!this.cupom.cupom.trim();
  };

}
