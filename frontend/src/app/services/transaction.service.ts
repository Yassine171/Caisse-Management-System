import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  url: string = environment.apiURL;
  jsonHeader = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };
  jsonHeaderfile = {
    headers: new HttpHeaders().set('Content-Type', 'text/csv'),
  }

  constructor(private http: HttpClient) {}

  add(data: any) {
    return this.http.post(`${this.url}/transaction/add`, data, this.jsonHeader);
  }

  update(data: any) {
    return this.http.patch(`${this.url}/transaction/update`, data, this.jsonHeader);
  }

  gettransactions() {
    return this.http.get(`${this.url}/transaction/get`,this.jsonHeader);
  }
  gettransactionsByUser(id: any) {
    return this.http.get(`${this.url}/transaction/get/user/${id}`,this.jsonHeader);
  }
  gettransactionsByDate(data :any) {
    return this.http.post(`${this.url}/transaction/get/date`,data, this.jsonHeader);
  }
  // updateStatus(data: any) {
  //   return this.http.patch(
  //     `${this.url}/transaction/updateStatus`,
  //     data,
  //     this.jsonHeader
  //   );
  // }

  getsoldeByDate(data :any) {
    return this.http.post(`${this.url}/transaction/get/solde/date`,data, this.jsonHeader);
  }
  delete(id: any) {
    return this.http.delete(
      `${this.url}/transaction/delete/${id}`,
      this.jsonHeader
    );
  }

  uploadFile(formData :FormData){
    return this.http.post(`${this.url}/transaction/uploadcsv`,formData,this.jsonHeaderfile);
  }

  getById(id: any) {
    return this.http.get(`${this.url}/transaction/getByID/${id}`);
  }
}
