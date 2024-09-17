package com.aninfo.service;

import com.aninfo.exceptions.DepositNegativeSumException;
import com.aninfo.exceptions.InsufficientFundsException;
import com.aninfo.model.Account;
import com.aninfo.model.Transaction;
import com.aninfo.repository.AccountRepository;
import com.aninfo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Collection<Account> getAccounts() {
        return accountRepository.findAll();
    }

    public Optional<Account> findById(Long cbu) {
        return accountRepository.findById(cbu);
    }

    public void save(Account account) {
        accountRepository.save(account);
    }

    public void deleteById(Long cbu) {
        accountRepository.deleteById(cbu);
    }

    @Transactional
    public Account withdraw(Long cbu, Double sum) {
        Account account = accountRepository.findAccountByCbu(cbu);

        if (account.getBalance() < sum) {
            throw new InsufficientFundsException("Insufficient funds");
        }

        account.setBalance(account.getBalance() - sum);
        accountRepository.save(account);

        // Crea una transacción de extracción
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(sum);
        transaction.setType("WITHDRAW");
        transactionRepository.save(transaction);

        return account;
    }

    @Transactional
    public Account deposit(Long cbu, Double sum) {

        if (sum <= 0) {
            throw new DepositNegativeSumException("Cannot deposit negative sums");
        }

        Account account = accountRepository.findAccountByCbu(cbu);

        // Aplica la promoción si el depósito es mayor o igual a 2000
        if (sum >= 2000) {
            Double bonus = Math.min(sum * 0.1, 500); // El bono es el 10% del depósito, hasta un máximo de 500
            sum += bonus;
        }
        account.setBalance(account.getBalance() + sum);
        accountRepository.save(account);

        // Crea una transacción de depósito
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(sum);
        transaction.setType("DEPOSIT");
        transactionRepository.save(transaction);

        return account;
    }

}
