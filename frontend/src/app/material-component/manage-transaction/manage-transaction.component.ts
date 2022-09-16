import { BillService } from './../../services/bill.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import jwt_decode from 'jwt-decode';

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
  csvRecords: any;
  tokenPayload :any;


  constructor(
    private datepipe: DatePipe,
    private transactionService: TransactionService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    private router: Router,
    private ngxCsvParser: NgxCsvParser
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    const token: string = localStorage.getItem('token')!;
    this.tokenPayload  = jwt_decode(token);
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
 this.getSolde();
  }

  getSolde(){
    let data = {
      date: this.dateForm.value.date,
    }
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
      this.dataSource.date_transaction=this.datepipe.transform(this.dataSource.date_transaction, 'yyyy-MM-dd');      this.ngxService.start();
      this.getSolde();
      let data = {
         solde:this.soldeTotal[0].totalSolde,
        date: this.datepipe.transform(this.dateForm.value.date, 'yyyy-MM-dd'),
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


@ViewChild('fileImportInput') fileImportInput: any;

fileChangeListener($event: any): void {

  const files = $event.srcElement.files;

  this.ngxCsvParser.parse(files[0], { header: true, delimiter: ',', encoding: 'utf8' })
    .pipe().subscribe({
      next: (result): void => {
        this.csvRecords = result;
        console.log("cssv",this.csvRecords);
        for (let i = 0; i < this.csvRecords.length; i++) {

          let data = {
          libelle: this.csvRecords[i].libelle,
          date_transaction:  this.datepipe.transform(this.csvRecords[i].date_transaction, 'yyyy-MM-dd'),
          recette: this.csvRecords[i].recette,
          depense: this.csvRecords[i].depense,
          userid: this.tokenPayload.id
        };
        this.transactionService.add(data).subscribe(
          (resp: any) => {
            this.responseMessage = resp.message;
            this.snackBar.openSnackBar(this.responseMessage, 'success');
            this.fileImportInput.nativeElement.value = "";
            this.tableData();
          },
          (error) => {
            if (error.error?.message) {
              this.responseMessage = error.error?.message;
            } else {
              this.responseMessage = GlobalConstants.genericError;
            }
            this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
          }
        );
        }


      },
      error: (error: NgxCSVParserError): void => {
        console.log('Error', error);
      }
    });

}
}

