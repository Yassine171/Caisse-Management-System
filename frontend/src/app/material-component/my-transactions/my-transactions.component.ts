import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from './../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { TransactionService } from 'src/app/services/transaction.service';
import jwt_decode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { TransactionComponent } from '../dialog/transaction/transaction.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss']
})
export class MyTransactionsComponent implements OnInit {
  tokenPayload :any;
  responseMessage: any;
  displayedColumns: string[] = [
    'Date',
    'Libelle',
    'Recettes',
    'Depenses',
    'UserName',
    'Edit'
  ];
  dataSource: any;

  constructor(
    private datepipe: DatePipe,
    private ngxService: NgxUiLoaderService,
    private transactionService: TransactionService,
    private snackBar: SnackbarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();

    const token: string = localStorage.getItem('token')!;
    this.tokenPayload  = jwt_decode(token);
  this.tableData(); }
  tableData() {
    this.transactionService.gettransactionsByUser(this.tokenPayload.id).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(resp.data);

   },(error) => {
    this.ngxService.stop();
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
  });

  }

  handleEditAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: value,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(TransactionComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditTransaction.subscribe(
      (resp: any) => {
        this.tableData();
        this.tableData();
        this.tableData();
      }
    );
  }

  handleDeleteAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + value.libelle + ' transaction',
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (resp: any) => {
        this.ngxService.start();
        this.deleteTransaction(value.id);
        dialogRef.close();
      }
    );
  }

  deleteTransaction(id: any) {
    this.transactionService.delete(id).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = resp?.message;
        this.snackBar.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

}
