package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.DivisionCropDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DivisionCropDetailsRepository extends JpaRepository<DivisionCropDetails, Integer> {
    // Helper to find all crop details for a specific division
    List<DivisionCropDetails> findByDivision_DivisionId(Integer divisionId);
}