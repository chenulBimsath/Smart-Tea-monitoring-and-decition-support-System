package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.DivisionNdviClimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DivisionNdviClimateRepository extends JpaRepository<DivisionNdviClimate, Integer> {

    /**
     * Monthly totals — converts text month names to numbers in SQL.
     * Handles both "January" and "Jan" formats.
     * Returns: [year(int), monthNum(int), totalGreenLeaf(numeric)]
     */
    @Query(value = """
        SELECT
            d.year,
            CASE LOWER(TRIM(d.month))
                WHEN 'january'   THEN 1  WHEN 'jan' THEN 1
                WHEN 'february'  THEN 2  WHEN 'feb' THEN 2
                WHEN 'march'     THEN 3  WHEN 'mar' THEN 3
                WHEN 'april'     THEN 4  WHEN 'apr' THEN 4
                WHEN 'may'       THEN 5
                WHEN 'june'      THEN 6  WHEN 'jun' THEN 6
                WHEN 'july'      THEN 7  WHEN 'jul' THEN 7
                WHEN 'august'    THEN 8  WHEN 'aug' THEN 8
                WHEN 'september' THEN 9  WHEN 'sep' THEN 9
                WHEN 'october'   THEN 10 WHEN 'oct' THEN 10
                WHEN 'november'  THEN 11 WHEN 'nov' THEN 11
                WHEN 'december'  THEN 12 WHEN 'dec' THEN 12
                ELSE CAST(d.month AS INTEGER)
            END AS month_num,
            SUM(d.green_leaf) AS total_green_leaf
        FROM division_ndvi_climate d
        WHERE d.green_leaf IS NOT NULL
        GROUP BY d.year, month_num
        ORDER BY d.year ASC, month_num ASC
        """, nativeQuery = true)
    List<Object[]> findMonthlyTotals();

    /**
     * Yearly totals.
     * Returns: [year(int), totalGreenLeaf(numeric)]
     */
    @Query(value = """
        SELECT
            d.year,
            SUM(d.green_leaf) AS total_green_leaf
        FROM division_ndvi_climate d
        WHERE d.green_leaf IS NOT NULL
        GROUP BY d.year
        ORDER BY d.year ASC
        """, nativeQuery = true)
    List<Object[]> findYearlyTotals();
}