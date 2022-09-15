import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionService } from 'src/app/services/transaction.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  onAddTransaction = new EventEmitter();
  onEditTransaction = new EventEmitter();
  transactionForm: any = UntypedFormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categories: any = [];
  tokenPayload :any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: UntypedFormBuilder,
    private datepipe: DatePipe,
    private transactionService: TransactionService,
    public dialogRef: MatDialogRef<TransactionComponent>,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    
    this.transactionForm = this.fb.group({
      libelle: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      date_transaction: [null, [Validators.required]],
      recette: [null ],
      depense: [null],
    });
    const token: string = localStorage.getItem('token')!;
    this.tokenPayload  = jwt_decode(token);
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.transactionForm.patchValue(this.dialogData.data);
    }

  }



  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else if (this.dialogAction === 'Add') {
      this.add();
    }
  }

  add() {
    console.log(this.tokenPayload.id)
    let formData = this.transactionForm.value;
    let data = {
      libelle: formData.libelle,
      date_transaction: formData.date_transaction,
      recette: formData.recette,
      depense: formData.depense,
      userid: this.tokenPayload.id
    };
    console.log(formData.date_transaction);
    console.log(data.date_transaction);

    this.transactionService.add(data).subscribe(
      (resp: any) => {
        this.dialogRef.close();
        this.onAddTransaction.emit();
        this.responseMessage = resp.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  edit() {
    let formData = this.transactionForm.value;
    let data = {
      id: this.dialogData.data.id,
      date_transaction: this.dialogData.date_transaction,
      libelle: formData.libelle,
      recette: formData.recette,
      depense: formData.depense
    };

    this.transactionService.update(data).subscribe(
      (resp: any) => {
        this.dialogRef.close();
        this.onEditTransaction.emit();
        this.responseMessage = resp.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  delete() {}
}
