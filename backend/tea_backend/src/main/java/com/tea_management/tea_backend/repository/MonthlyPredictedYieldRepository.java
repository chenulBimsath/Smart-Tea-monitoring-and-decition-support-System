package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.MonthlyPredictedYield;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthlyPredictedYieldRepository extends JpaRepository<MonthlyPredictedYield, Integer> {

    // Get all predictions for a specific year+month
    List<MonthlyPredictedYield> findByYearAndMonth(Integer year, Integer month);

    // Get latest predictions (all divisions, most recent year+month)
    List<MonthlyPredictedYield> findAllByOrderByYearDescMonthDesc();
}
