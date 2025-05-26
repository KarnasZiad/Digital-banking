import { Customer } from './customer.model';

export interface BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  status: AccountStatus;
  customerDTO: Customer;
  type: string;
}

export interface CurrentBankAccount extends BankAccount {
  overDraft: number;
}

export interface SavingBankAccount extends BankAccount {
  interestRate: number;
}

export enum AccountStatus {
  CREATED = 'CREATED',
  ACTIVATED = 'ACTIVATED',
  SUSPENDED = 'SUSPENDED'
}

export interface AccountOperation {
  id?: number;
  operationDate: Date;
  amount: number;
  type: OperationType;
  description: string;
  bankAccount?: BankAccount;
}

export enum OperationType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}
