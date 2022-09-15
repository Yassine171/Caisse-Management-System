import { TestBed, inject, getTestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpTestingController: HttpTestingController;
  localStorage.setItem('token', 'any auth token here');
  const authToken = localStorage.getItem('token');
   /**
  * Using sample data to check implementation of CRUD methods
  */
    const mockData =      [{
            "id": 77,
            "libelle": "updated",
            "date_transaction": "2022-10-02T00:00:00.000Z",
            "recette": 100,
            "depense": 50,
            "userID": 1,
            "solde": "50"
        },
        {
            "id": 78,
            "libelle": "jkhk",
            "date_transaction": "2022-10-02T00:00:00.000Z",
            "recette": 69,
            "depense": 67,
            "userID": 1,
            "solde": "52"
        }]


      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            TransactionService,
            { provide: 'url',
              useValue: 'apiurl'
            }],
           imports: [HttpClientTestingModule]
           } );
         service = TestBed.inject(TransactionService);
         httpTestingController = TestBed.get(HttpTestingController);
      });
      afterEach(() => {
       httpTestingController.verify();
      });

      it('getAll should make a GET HTTP request and return all data items', () => {
        service.gettransactions().subscribe(res => {
          expect(res).toBe('real value');
          expect(res).toEqual(mockData);
          expect(res).toBe(2);
         });
        const req = httpTestingController.expectOne('apiUrl/transaction/get');
        expect(req.request.method).toBe('GET');
        expect(req.cancelled).toBeFalsy();
        expect(req.request.responseType).toEqual('json');
        expect(req.request.headers.has('Authorization')).toEqual(true);
  expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
        req.flush(mockData);
        httpTestingController.verify();
       });

 it('gettransactionsByDate should make a GET HTTP request with id appended to end of url', () => {
  service.gettransactionsByDate({"date_transaction": "2022-10-02T00:00:00.000Z"}).subscribe(res => {
    expect(res).toEqual(mockData);
   });
  const req = httpTestingController.expectOne('apiUrl/transaction/get/date');
  expect(req.request.method).toBe('POST');
  expect(req.cancelled).toBeFalsy();
  expect(req.request.responseType).toEqual('json');
  expect(req.request.headers.has('Authorization')).toEqual(true);
  expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
  req.flush(mockData);
  httpTestingController.verify();
 });
  it('delete should make a DELETE HTTP request with id appended to end of url', () => {
  service.delete(77).subscribe(res => {
    expect(res).toBe(1);
   });
  const req = httpTestingController.expectOne('apiUrl/transaction/delete/77', 'delete to api');
  expect(req.request.method).toBe('DELETE');
  expect(req.cancelled).toBeFalsy();
  expect(req.request.responseType).toEqual('json');
  expect(req.request.headers.has('Authorization')).toEqual(true);
  expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
  req.flush(1);
  httpTestingController.verify();
 });

 it('update should make a PATCH HTTP request with id appended to end of url and resource as body', () => {
  const updateObj ={id:77 ,libelle: "updated new",recette: 100,depense: 50,userID: 1,solde: "50"};
  service.update(updateObj).subscribe(res => {
    expect(res).toBe('transaction updated successfully');
   });
  const req = httpTestingController.expectOne('apiUrl/transaction/update', 'put to api');
  expect(req.request.method).toBe('PATCH');
  expect(req.request.body).toBe(updateObj);
  expect(req.cancelled).toBeFalsy();
  expect(req.request.responseType).toEqual('json');
  expect(req.request.headers.has('Authorization')).toEqual(true);
  expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
  req.flush(updateObj);
  httpTestingController.verify();
 });

  it('create should make a POST HTTP request with resource as body', () => {
  const createObj = {libelle: "add new",date_transaction:"17-01-2022",recette: 100,depense: 50,userID: 1,solde: "50"};
  service.add(createObj).subscribe(res => {
    expect(res).toBe('transaction add successfully');
   });
  const req = httpTestingController.expectOne('apiUrl/transaction/add', 'post to api');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toBe(createObj);
  expect(req.cancelled).toBeFalsy();
  expect(req.request.responseType).toEqual('json');
  expect(req.request.headers.has('Authorization')).toEqual(true);
  expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
  req.flush(createObj);
  httpTestingController.verify();
  });
});









