package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.FertilizerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FertilizerDataRepository extends JpaRepository<FertilizerData, Integer> {
    // Custom method to fetch data by specific field number
    List<FertilizerData> findByFieldNo(Integer fieldNo);
}