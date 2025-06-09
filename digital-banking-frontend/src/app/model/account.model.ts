export interface AccountDetails {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  accountOperationDTOS: AccountOperation[];
}

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          string;
  description:   string;
}

export interface BankAccount {
  id:          string;
  type:        string;
  balance:     number;
  createdAt:   Date;
  status:      string;
  customerId: number;
}

export interface CurrentAccount extends BankAccount {
  overDraft: number;
}

export interface SavingAccount extends BankAccount {
  interestRate: number;
}

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  operations: AccountOperation[];
}
