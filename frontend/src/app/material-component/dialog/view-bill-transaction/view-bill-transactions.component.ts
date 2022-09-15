import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-transactions',
  templateUrl: './view-bill-transactions.component.html',
  styleUrls: ['./view-bill-transactions.component.scss'],
})
export class ViewBillTransactionsComponent implements OnInit {
  displayedColumns: string[] = [
    'Date',
    'Libelle',
    'Recettes',
    'Depenses',
    'Solde',
  ];
  dataSource: any = [];
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ViewBillTransactionsComponent>
  ) {}

  ngOnInit() {
    console.log("what i get",this.dialogData);
    this.data = this.dialogData;
    this.dataSource = this.data.transactionsDetails;
  }
}
