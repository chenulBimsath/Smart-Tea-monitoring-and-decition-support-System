package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DivisionRepository extends JpaRepository<Division, Integer> {
    // Custom method to find all divisions for a specific estate
    List<Division> findByEstate_EstateId(Integer estateId);
}