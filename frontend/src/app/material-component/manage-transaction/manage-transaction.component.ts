import { BillService } from './../../services/bill.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TransactionService } from 'src/app/services/transaction.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { TransactionComponent } from '../dialog/transaction/transaction.component';
import {FormControl, FormGroup} from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-transaction',
  templateUrl: './manage-transaction.component.html',
  styleUrls: ['./manage-transaction.component.scss'],
})



export class ManageTransactionComponent implements OnInit {

  displayedColumns: string[] = [
    'Date',
    'Libelle',
    'Recettes',
    'Depenses',
    'Solde',
    'Edit'
  ];
  dataSource: any;
  soldeTotal:any;
  dateForm: any = UntypedFormGroup;
  responseMessage: any;
  fromDate:any;


  constructor(
    private datepipe: DatePipe,
    private transactionService: TransactionService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
    this.tableData();
    this.tableData();

    this.dateForm = this.fb.group({
      date: [
        null,
        [Validators.required],
      ]
    });

  }



  tableData() {
    this.transactionService.gettransactions().subscribe(
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



  applyFilter() {
    // event.preventDefault();
    let data = {
      date: this.dateForm.value.date,
    }
    this.transactionService.gettransactionsByDate(data).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.dataSource =resp;

   },(error) => {
    this.ngxService.stop();
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
  });

  this.transactionService.getsoldeByDate(data).subscribe(
    (resp: any) => {
      this.ngxService.stop();
      this.soldeTotal =resp;
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

  disable(){
    if(this.dataSource.length >0 && this.dateForm.value.date){

      return false;
   }
   return true;
  }

  handleInsertAction(){
    if(this.dataSource.length >0 && this.dateForm.value.date){
      this.ngxService.start();
      let data = {
         solde:this.soldeTotal[0].totalSolde,
        date: this.dateForm.value.date,
        transactionsDetails: JSON.stringify(this.dataSource)
      };
      this.billService.generateReport(data).subscribe(
        (resp: any) => {
          this.downloadFile(resp?.date);
          this.dateForm.reset();
          this.tableData();
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

downloadFile(fileName: any) {
  let data = {
    date: fileName,
  };

  this.billService.getPDF(data).subscribe((resp: any) => {
    saveAs(resp, fileName + '.pdf');
    this.ngxService.stop();
  });
}

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(TransactionComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddTransaction.subscribe(
      (resp: any) => {
        this.tableData();
      }
    );
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

  fileupload(event :Event) {
    const target= event.target as HTMLInputElement;
    if (!target.files?.length) {
      return;
  }
    let file: File = target.files[0] as File;
    let formData = new FormData();

    formData.append("file", file, file.name);
    this.transactionService.uploadFile(formData).subscribe(   (resp: any) => {
      this.ngxService.stop();
      this.dataSource.push(resp);
    },(error) => {
  this.ngxService.stop();
  if (error.error?.message) {
    this.responseMessage = error.error?.message;
  } else {
    this.responseMessage = GlobalConstants.genericError;
  }
  this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
});}}


