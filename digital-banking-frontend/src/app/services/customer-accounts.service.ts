import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BankAccount, AccountHistory, CurrentAccount, SavingAccount } from '../model/account.model';
import { Customer } from '../model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerAccountsService {
  constructor(private http: HttpClient) { }

  public getCustomerAccounts(customerId: number): Observable<Array<BankAccount>> {
    return this.http.get<Array<BankAccount>>(`${environment.backendHost}/customers/${customerId}/accounts`);
  }

  public getAccountHistory(accountId: string, page: number = 0, size: number = 10): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(
      `${environment.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`
    );
  }

  public getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.backendHost}/customers/${customerId}`);
  }

  public saveCurrentAccount(balance: number, overDraft: number, customerId: number): Observable<CurrentAccount> {
    return this.http.post<CurrentAccount>(`${environment.backendHost}/accounts/current`, {
      balance,
      overDraft,
      customerId
    });
  }

  public saveSavingAccount(balance: number, interestRate: number, customerId: number): Observable<SavingAccount> {
    return this.http.post<SavingAccount>(`${environment.backendHost}/accounts/saving`, {
      balance,
      interestRate,
      customerId
    });
  }

  public deleteAccount(accountId: string): Observable<any> {
    return this.http.delete(`${environment.backendHost}/accounts/${accountId}`);
  }
}