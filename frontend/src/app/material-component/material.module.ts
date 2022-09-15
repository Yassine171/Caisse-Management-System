import { DataTablesModule } from 'angular-datatables';
import { ViewBillTransactionsComponent } from './dialog/view-bill-transaction/view-bill-transactions.component';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';
import { TransactionComponent } from './dialog/transaction/transaction.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';

@NgModule({
  imports: [
    DataTablesModule,
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [DatePipe],
  declarations: [

    ViewBillTransactionsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageTransactionComponent,
    TransactionComponent,
    ViewBillComponent,
    ManageUserComponent,
    MyTransactionsComponent
  ]
})
export class MaterialComponentsModule {}
