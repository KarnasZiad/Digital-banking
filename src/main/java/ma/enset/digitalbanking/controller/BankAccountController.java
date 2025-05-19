package ma.enset.digitalbanking.controller;

import lombok.AllArgsConstructor;
import ma.enset.digitalbanking.dtos.*;
import ma.enset.digitalbanking.exceptions.BalanceNotSufficientException;
import ma.enset.digitalbanking.exceptions.BankAccountNotFoundException;
import ma.enset.digitalbanking.exceptions.CustomerNotFoundException;
import ma.enset.digitalbanking.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@AllArgsConstructor
public class BankAccountController {
    private final BankAccountService bankAccountService;

    /**
     * Créer un compte courant
     */
    @PostMapping("/current")
    public CurrentBankAccountDTO createCurrentAccount(@RequestParam double initialBalance,
                                                      @RequestParam double overDraft,
                                                      @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveCurrentBankAccount(initialBalance, overDraft, customerId);
    }

    /**
     * Créer un compte épargne
     */
    @PostMapping("/saving")
    public SavingBankAccountDTO createSavingAccount(@RequestParam double initialBalance,
                                                    @RequestParam double interestRate,
                                                    @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveSavingBankAccount(initialBalance, interestRate, customerId);
    }

    /**
     * Débiter un compte
     */
    @PostMapping("/{accountId}/debit")
    public void debitAccount(@PathVariable String accountId,
                             @RequestParam double amount,
                             @RequestParam String description) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.debit(accountId, amount, description);
    }

    /**
     * Créditer un compte
     */
    @PostMapping("/{accountId}/credit")
    public void creditAccount(@PathVariable String accountId,
                              @RequestParam double amount,
                              @RequestParam String description) throws BankAccountNotFoundException {
        bankAccountService.credit(accountId, amount, description);
    }

    /**
     * Transférer entre deux comptes
     */
    @PostMapping("/transfer")
    public void transfer(@RequestParam String sourceAccountId,
                         @RequestParam String destinationAccountId,
                         @RequestParam double amount) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.transfer(sourceAccountId, destinationAccountId, amount);
    }

    /**
     * Récupérer les détails d'un compte
     */
    @GetMapping("/{accountId}")
    public BankAccountDTO getAccountDetails(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }

    /**
     * Historique des opérations d'un compte
     */
    @GetMapping("/{accountId}/history")
    public AccountHistoryDTO getAccountHistory(@PathVariable String accountId,
                                               @RequestParam int page,
                                               @RequestParam int size) throws BankAccountNotFoundException {
        return bankAccountService.getAccountHistory(accountId, page, size);
    }

    /**
     * Liste de tous les comptes
     */
    @GetMapping
    public List<BankAccountDTO> getAllAccounts() {
        return bankAccountService.bankAccountList();
    }
}