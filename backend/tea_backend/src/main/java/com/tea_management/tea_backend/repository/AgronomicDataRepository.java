package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.AgronomicData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgronomicDataRepository extends JpaRepository<AgronomicData, Integer> {
    // Custom method to fetch data by specific field number if needed
    List<AgronomicData> findByFieldNo(String fieldNo);
}