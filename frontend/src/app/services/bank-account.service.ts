import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, CurrentBankAccount, SavingBankAccount, AccountHistory } from '../models/bank-account.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private apiUrl = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) { }

  getAllAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getAccount(accountId: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${accountId}`);
  }

  createCurrentAccount(initialBalance: number, overDraft: number, customerId: number): Observable<CurrentBankAccount> {
    const params = new HttpParams()
      .set('initialBalance', initialBalance.toString())
      .set('overDraft', overDraft.toString())
      .set('customerId', customerId.toString());
    
    return this.http.post<CurrentBankAccount>(`${this.apiUrl}/current`, null, { params });
  }

  createSavingAccount(initialBalance: number, interestRate: number, customerId: number): Observable<SavingBankAccount> {
    const params = new HttpParams()
      .set('initialBalance', initialBalance.toString())
      .set('interestRate', interestRate.toString())
      .set('customerId', customerId.toString());
    
    return this.http.post<SavingBankAccount>(`${this.apiUrl}/saving`, null, { params });
  }

  debitAccount(accountId: string, amount: number, description: string): Observable<void> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('description', description);
    
    return this.http.post<void>(`${this.apiUrl}/${accountId}/debit`, null, { params });
  }

  creditAccount(accountId: string, amount: number, description: string): Observable<void> {
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('description', description);
    
    return this.http.post<void>(`${this.apiUrl}/${accountId}/credit`, null, { params });
  }

  transfer(sourceAccountId: string, destinationAccountId: string, amount: number): Observable<void> {
    const params = new HttpParams()
      .set('sourceAccountId', sourceAccountId)
      .set('destinationAccountId', destinationAccountId)
      .set('amount', amount.toString());
    
    return this.http.post<void>(`${this.apiUrl}/transfer`, null, { params });
  }

  getAccountHistory(accountId: string, page: number, size: number): Observable<AccountHistory> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<AccountHistory>(`${this.apiUrl}/${accountId}/history`, { params });
  }
}
