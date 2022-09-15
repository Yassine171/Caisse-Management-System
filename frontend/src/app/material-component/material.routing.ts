import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ViewBillComponent } from './view-bill/view-bill.component';

export const MaterialRoutes: Routes = [
  {

    path: 'transaction',
    component: ManageTransactionComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin','user'],
    },
  },
  {
    path: 'bill',
    component: ViewBillComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'],
    },
  },
  {
    path: 'my-transaction',
    component: MyTransactionsComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'],
    },
  },
  {
    path: 'user',
    component: ManageUserComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin','user'],
    },
  },
];
