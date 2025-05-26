import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { BankAccountService } from '../../services/bank-account.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalCustomers = 0;
  totalAccounts = 0;
  totalBalance = 0;

  constructor(
    private customerService: CustomerService,
    private accountService: BankAccountService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.totalCustomers = 0;
      }
    });

    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.totalAccounts = 0;
        this.totalBalance = 0;
      }
    });
  }
}
