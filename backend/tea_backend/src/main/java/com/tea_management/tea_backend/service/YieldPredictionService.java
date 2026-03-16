package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.model.MonthlyPredictedYield;
import com.tea_management.tea_backend.repository.DivisionNdviClimateRepository;
import com.tea_management.tea_backend.repository.MonthlyPredictedYieldRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/service/YieldPredictionService.java
 */
@Service
public class YieldPredictionService {

    private final MonthlyPredictedYieldRepository predRepo;
    private final DivisionNdviClimateRepository   climateRepo;

    public YieldPredictionService(MonthlyPredictedYieldRepository predRepo,
                                  DivisionNdviClimateRepository climateRepo) {
        this.predRepo    = predRepo;
        this.climateRepo = climateRepo;
    }

    /**
     * Latest prediction per division — keeps only the most recent year+month per division.
     */
    public List<MonthlyPredictedYield> getLatestPredictions() {
        List<MonthlyPredictedYield> all = predRepo.findAllByOrderByYearDescMonthDesc();

        // One entry per division (most recent)
        Map<String, MonthlyPredictedYield> latest = new LinkedHashMap<>();
        for (MonthlyPredictedYield row : all) {
            latest.putIfAbsent(row.getDivision(), row);
        }
        return new ArrayList<>(latest.values());
    }

    /**
     * Monthly yield totals across all divisions — for the bar chart.
     * Returns list of {yearMonth: "2024-01", totalGreenLeaf: 42300}
     */
    public List<Map<String, Object>> getMonthlyTotals() {
        List<Object[]> rows = climateRepo.findMonthlyTotals();

        // Month name → number mapping (DB stores months as text e.g. "Jan")
        Map<String, Integer> monthNums = Map.ofEntries(
            Map.entry("jan",1), Map.entry("feb",2), Map.entry("mar",3),
            Map.entry("apr",4), Map.entry("may",5), Map.entry("jun",6),
            Map.entry("jul",7), Map.entry("aug",8), Map.entry("sep",9),
            Map.entry("oct",10),Map.entry("nov",11),Map.entry("dec",12),
            Map.entry("january",1),Map.entry("february",2),Map.entry("march",3),
            Map.entry("april",4), Map.entry("june",6), Map.entry("july",7),
            Map.entry("august",8),Map.entry("september",9),Map.entry("october",10),
            Map.entry("november",11),Map.entry("december",12)
        );

        return rows.stream().map(row -> {
            int year     = ((Number) row[0]).intValue();
            String month = String.valueOf(row[1]).toLowerCase().trim();
            int monthNum = monthNums.getOrDefault(month, 0);
            long total   = row[2] != null ? ((Number) row[2]).longValue() : 0L;

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("yearMonth",      String.format("%d-%02d", year, monthNum));
            m.put("year",           year);
            m.put("month",          month);
            m.put("totalGreenLeaf", total);
            return m;
        }).sorted(Comparator.comparing(m -> (String) m.get("yearMonth")))
          .collect(Collectors.toList());
    }

    /**
     * Yearly totals — for the yearly chart tab.
     * Returns list of {year: 2024, totalGreenLeaf: 312000}
     */
    public List<Map<String, Object>> getYearlyTotals() {
        List<Object[]> rows = climateRepo.findYearlyTotals();

        return rows.stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("year",           ((Number) row[0]).intValue());
            m.put("totalGreenLeaf", row[1] != null ? ((Number) row[1]).longValue() : 0L);
            return m;
        }).collect(Collectors.toList());
    }
}
