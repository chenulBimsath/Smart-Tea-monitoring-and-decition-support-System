package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.FinancialData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialDataRepository extends JpaRepository<FinancialData, Integer> {
    // Custom method to fetch data by category or transaction type if needed
    List<FinancialData> findByCategory(String category);
    List<FinancialData> findByTransactionType(String transactionType);
}