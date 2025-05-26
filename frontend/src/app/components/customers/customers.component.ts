import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  currentCustomer: Customer = { name: '', email: '' };
  searchKeyword = '';
  showAddForm = false;
  editingCustomer = false;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.loading = false;
      }
    });
  }

  searchCustomers() {
    if (this.searchKeyword.trim()) {
      this.loading = true;
      this.customerService.searchCustomers(this.searchKeyword).subscribe({
        next: (customers) => {
          this.customers = customers;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadCustomers();
    }
  }

  saveCustomer() {
    if (this.editingCustomer && this.currentCustomer.id) {
      this.customerService.updateCustomer(this.currentCustomer.id, this.currentCustomer).subscribe({
        next: (customer) => {
          const index = this.customers.findIndex(c => c.id === customer.id);
          if (index !== -1) {
            this.customers[index] = customer;
          }
          this.cancelForm();
          alert('Client modifié avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          alert('Erreur lors de la modification du client');
        }
      });
    } else {
      this.customerService.createCustomer(this.currentCustomer).subscribe({
        next: (customer) => {
          this.customers.push(customer);
          this.cancelForm();
          alert('Client ajouté avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          alert('Erreur lors de la création du client');
        }
      });
    }
  }

  editCustomer(customer: Customer) {
    this.currentCustomer = { ...customer };
    this.editingCustomer = true;
    this.showAddForm = true;
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${customer.name}" ?`)) {
      this.customerService.deleteCustomer(customer.id!).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== customer.id);
          alert('Client supprimé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }

  viewCustomerAccounts(customer: Customer) {
    this.router.navigate(['/accounts'], { queryParams: { customerId: customer.id } });
  }

  cancelForm() {
    this.currentCustomer = { name: '', email: '' };
    this.editingCustomer = false;
    this.showAddForm = false;
  }
}
