import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BankAccountService } from '../../services/bank-account.service';
import { CustomerService } from '../../services/customer.service';
import { BankAccount } from '../../models/bank-account.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accounts: BankAccount[] = [];
  customers: Customer[] = [];
  searchAccountId = '';
  showCreateAccountForm = false;
  showTransactionForm = false;
  loading = false;

  newAccount = {
    customerId: '',
    type: '',
    initialBalance: 0,
    overDraft: 0,
    interestRate: 0
  };

  transaction = {
    type: '',
    sourceAccountId: '',
    destinationAccountId: '',
    amount: 0,
    description: ''
  };

  constructor(
    private accountService: BankAccountService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCustomers();

    // Vérifier si on vient de la page clients avec un customerId
    this.route.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.newAccount.customerId = params['customerId'];
        this.showCreateAccountForm = true;
      }
    });
  }

  loadAccounts() {
    this.loading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.loading = false;
      }
    });
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
      }
    });
  }

  searchAccount() {
    if (this.searchAccountId.trim()) {
      this.loading = true;
      this.accountService.getAccount(this.searchAccountId).subscribe({
        next: (account) => {
          this.accounts = [account];
          this.loading = false;
        },
        error: (error) => {
          console.error('Compte non trouvé:', error);
          this.accounts = [];
          this.loading = false;
          alert('Compte non trouvé');
        }
      });
    } else {
      this.loadAccounts();
    }
  }

  createAccount() {
    const customerId = Number(this.newAccount.customerId);

    if (this.newAccount.type === 'current') {
      this.accountService.createCurrentAccount(
        this.newAccount.initialBalance,
        this.newAccount.overDraft,
        customerId
      ).subscribe({
        next: (account) => {
          console.log('Compte créé avec succès:', account);
          this.accounts.push(account);
          this.cancelCreateForm();
          this.loadAccounts(); // Recharger la liste pour être sûr
          alert('Compte courant créé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          alert('Erreur lors de la création du compte: ' + error.message);
        }
      });
    } else if (this.newAccount.type === 'saving') {
      this.accountService.createSavingAccount(
        this.newAccount.initialBalance,
        this.newAccount.interestRate,
        customerId
      ).subscribe({
        next: (account) => {
          console.log('Compte épargne créé avec succès:', account);
          this.accounts.push(account);
          this.cancelCreateForm();
          this.loadAccounts(); // Recharger la liste pour être sûr
          alert('Compte épargne créé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          alert('Erreur lors de la création du compte: ' + error.message);
        }
      });
    }
  }

  executeTransaction() {
    const amount = this.transaction.amount;
    const description = this.transaction.description || 'Transaction';

    if (this.transaction.type === 'debit') {
      this.accountService.debitAccount(
        this.transaction.sourceAccountId,
        amount,
        description
      ).subscribe({
        next: () => {
          this.loadAccounts();
          this.cancelTransactionForm();
          alert('Débit effectué avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors du débit:', error);
          alert('Erreur lors du débit');
        }
      });
    } else if (this.transaction.type === 'credit') {
      this.accountService.creditAccount(
        this.transaction.sourceAccountId,
        amount,
        description
      ).subscribe({
        next: () => {
          this.loadAccounts();
          this.cancelTransactionForm();
          alert('Crédit effectué avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors du crédit:', error);
          alert('Erreur lors du crédit');
        }
      });
    } else if (this.transaction.type === 'transfer') {
      this.accountService.transfer(
        this.transaction.sourceAccountId,
        this.transaction.destinationAccountId,
        amount
      ).subscribe({
        next: () => {
          this.loadAccounts();
          this.cancelTransactionForm();
          alert('Virement effectué avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors du virement:', error);
          alert('Erreur lors du virement');
        }
      });
    }
  }

  viewAccountHistory(account: BankAccount) {
    this.router.navigate(['/operations', account.id]);
  }

  quickTransaction(account: BankAccount) {
    this.transaction.sourceAccountId = account.id;
    this.showTransactionForm = true;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVATED': return 'bg-success';
      case 'SUSPENDED': return 'bg-warning';
      case 'CREATED': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  cancelCreateForm() {
    this.newAccount = {
      customerId: '',
      type: '',
      initialBalance: 0,
      overDraft: 0,
      interestRate: 0
    };
    this.showCreateAccountForm = false;
  }

  cancelTransactionForm() {
    this.transaction = {
      type: '',
      sourceAccountId: '',
      destinationAccountId: '',
      amount: 0,
      description: ''
    };
    this.showTransactionForm = false;
  }
}