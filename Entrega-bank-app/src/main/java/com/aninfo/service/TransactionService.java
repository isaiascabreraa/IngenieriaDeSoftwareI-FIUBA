package com.aninfo.service;

import com.aninfo.exceptions.DepositNegativeSumException;
import com.aninfo.exceptions.InsufficientFundsException;
import com.aninfo.model.Account;
import com.aninfo.model.Transaction;
import com.aninfo.repository.AccountRepository;
import com.aninfo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import javax.transaction.Transactional;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Transaction createTransaction(Long cbu, Double amount, String type) {

        Account account = accountRepository.findAccountByCbu(cbu);

        if (type.equals("WITHDRAW") && account.getBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds");
        }

        if (type.equals("DEPOSIT") && amount <= 0) {
            throw new DepositNegativeSumException("Cannot deposit negative sums");
        }

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setType(type);

        transactionRepository.save(transaction);

        if (type.equals("WITHDRAW")) {
            account.setBalance(account.getBalance() - amount);
        } else if (type.equals("DEPOSIT")) {
            account.setBalance(account.getBalance() + amount);
        }

        accountRepository.save(account);

        return transaction;
    }

    public List<Transaction> getTransactions(Long cbu) {
        return transactionRepository.findByAccountCbu(cbu);
    }

    public Double getLastTransactionAmount(Long cbu) {
        List<Transaction> transactions = transactionRepository.findByAccountCbu(cbu);
        Transaction lastTransaction = transactions.get(transactions.size() - 1);
        return lastTransaction.getAmount();
    }

}
