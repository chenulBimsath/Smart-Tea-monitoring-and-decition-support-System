package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.DivisionNdviClimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DivisionNdviClimateRepository extends JpaRepository<DivisionNdviClimate, Integer> {

    // All records ordered by year + month — used for chart
    List<DivisionNdviClimate> findAllByOrderByYearAscMonthAsc();

    // Aggregate monthly totals across all divisions (for chart)
    @Query(value = """
        SELECT d.year, d.month,
               SUM(d.green_leaf) AS total_green_leaf
        FROM division_ndvi_climate d
        GROUP BY d.year, d.month
        ORDER BY d.year ASC, d.month ASC
        """, nativeQuery = true)
    List<Object[]> findMonthlyTotals();

    // Aggregate yearly totals (for chart)
    @Query(value = """
        SELECT d.year,
               SUM(d.green_leaf) AS total_green_leaf
        FROM division_ndvi_climate d
        GROUP BY d.year
        ORDER BY d.year ASC
        """, nativeQuery = true)
    List<Object[]> findYearlyTotals();
}
