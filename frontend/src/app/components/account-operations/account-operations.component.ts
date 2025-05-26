import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountService } from '../../services/bank-account.service';
import { BankAccount, AccountHistory } from '../../models/bank-account.model';

@Component({
  selector: 'app-account-operations',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-operations.component.html',
  styleUrl: './account-operations.component.css'
})
export class AccountOperationsComponent implements OnInit {
  accountId!: string;
  account?: BankAccount;
  accountHistory?: AccountHistory;
  currentPage = 0;
  pageSize = 10;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: BankAccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      if (this.accountId) {
        this.loadAccountInfo();
        this.loadAccountHistory();
      }
    });
  }

  loadAccountInfo() {
    this.accountService.getAccount(this.accountId).subscribe({
      next: (account) => {
        this.account = account;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du compte:', error);
        alert('Compte non trouvé');
        this.router.navigate(['/accounts']);
      }
    });
  }

  loadAccountHistory() {
    this.loading = true;
    this.accountService.getAccountHistory(this.accountId, this.currentPage, this.pageSize).subscribe({
      next: (history) => {
        this.accountHistory = history;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'historique:', error);
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && this.accountHistory && page < this.accountHistory.totalPages) {
      this.currentPage = page;
      this.loadAccountHistory();
    }
  }

  getPageNumbers(): number[] {
    if (!this.accountHistory) return [];

    const totalPages = this.accountHistory.totalPages;
    const pages: number[] = [];

    // Afficher au maximum 5 pages autour de la page courante
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(totalPages - 1, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
