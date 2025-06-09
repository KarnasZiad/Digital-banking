import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../model/customer.model";
import { BankAccount, AccountHistory } from '../model/account.model';
import { CustomerAccountsService } from '../services/customer-accounts.service';
import { catchError, Observable, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer?: Customer;
  accounts: BankAccount[] = [];
  errorMessage: string = '';
  accountHistory?: AccountHistory;
  isLoading: boolean = false;
  newAccountForm?: FormGroup;
  showNewAccountForm: boolean = false;
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountsService: CustomerAccountsService,
    private fb: FormBuilder
  ) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.loadCustomerData();
    this.initNewAccountForm();
  }

  private initNewAccountForm() {
    this.newAccountForm = this.fb.group({
      accountType: ['current', [Validators.required]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      overDraft: [0, [Validators.required, Validators.min(0)]],
      interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    // Subscribe to account type changes to update validation
    this.newAccountForm.get('accountType')?.valueChanges.subscribe(type => {
      const overDraftControl = this.newAccountForm?.get('overDraft');
      const interestRateControl = this.newAccountForm?.get('interestRate');
      
      if (type === 'current') {
        overDraftControl?.enable();
        interestRateControl?.disable();
      } else {
        overDraftControl?.disable();
        interestRateControl?.enable();
      }
    });
  }

  loadCustomerData() {
    this.isLoading = true;
    if (this.customer == null) {
      this.accountsService.getCustomer(Number(this.customerId)).pipe(
        catchError(err => {
          this.errorMessage = err.error?.message || 'Error loading customer data';
          this.isLoading = false;
          return throwError(() => err);
        })
      ).subscribe({
        next: (customer) => {
          this.customer = customer;
          this.loadCustomerAccounts();
        }
      });
    } else {
      this.loadCustomerAccounts();
    }
  }

  loadCustomerAccounts() {
    this.accountsService.getCustomerAccounts(Number(this.customerId)).pipe(
      catchError(err => {
        this.errorMessage = err.error?.message || 'Error loading accounts';
        this.isLoading = false;
        return throwError(() => err);
      })
    ).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoading = false;
      }
    });
  }

  handleOperations(account: BankAccount) {
    this.router.navigateByUrl("/accounts", { 
      state: { accountId: account.id }
    });
  }

  handleNewAccount() {
    if (!this.newAccountForm?.valid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.newAccountForm?.controls || {}).forEach(key => {
        const control = this.newAccountForm?.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    const formValue = this.newAccountForm?.value;
    const customerId = Number(this.customerId);
    
    if (formValue.accountType === 'current') {
      this.accountsService.saveCurrentAccount(
        formValue.initialBalance,
        formValue.overDraft,
        customerId
      ).pipe(
        catchError(err => {
          this.errorMessage = err.error?.message || 'Error creating current account';
          return throwError(() => err);
        })
      ).subscribe({
        next: () => {
          this.showSuccessMessage('Current account created successfully');
          this.resetForm();
        }
      });
    } else {
      this.accountsService.saveSavingAccount(
        formValue.initialBalance,
        formValue.interestRate,
        customerId
      ).pipe(
        catchError(err => {
          this.errorMessage = err.error?.message || 'Error creating saving account';
          return throwError(() => err);
        })
      ).subscribe({
        next: () => {
          this.showSuccessMessage('Saving account created successfully');
          this.resetForm();
        }
      });
    }
  }

  handleDeleteAccount(account: BankAccount) {
    if (confirm(`Are you sure you want to delete account ${account.id}?`)) {
      this.accountsService.deleteAccount(account.id).pipe(
        catchError(err => {
          this.errorMessage = err.error?.message || 'Error deleting account';
          return throwError(() => err);
        })
      ).subscribe({
        next: () => {
          this.loadCustomerAccounts();
        }
      });
    }
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  private resetForm() {
    this.showNewAccountForm = false;
    this.loadCustomerAccounts();
    this.newAccountForm?.reset({
      accountType: 'current',
      initialBalance: 0,
      overDraft: 0,
      interestRate: 0
    });
  }
}
