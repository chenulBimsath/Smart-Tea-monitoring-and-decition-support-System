package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.model.MonthlyPredictedYield;
import com.tea_management.tea_backend.repository.DivisionNdviClimateRepository;
import com.tea_management.tea_backend.repository.MonthlyPredictedYieldRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class YieldPredictionService {

    private final MonthlyPredictedYieldRepository predRepo;
    private final DivisionNdviClimateRepository   climateRepo;

    public YieldPredictionService(MonthlyPredictedYieldRepository predRepo,
                                  DivisionNdviClimateRepository climateRepo) {
        this.predRepo    = predRepo;
        this.climateRepo = climateRepo;
    }

    // ── Latest prediction per division ────────────────────────────────────────
    public List<MonthlyPredictedYield> getLatestPredictions() {
        List<MonthlyPredictedYield> all = predRepo.findAllByOrderByYearDescMonthDesc();

        // Keep only the most recent entry per division
        Map<String, MonthlyPredictedYield> latest = new LinkedHashMap<>();
        for (MonthlyPredictedYield row : all) {
            latest.putIfAbsent(row.getDivision(), row);
        }
        return new ArrayList<>(latest.values());
    }

    // ── Monthly totals for chart ──────────────────────────────────────────────
    // SQL already returns month as a number (1-12), so no text conversion needed
    public List<Map<String, Object>> getMonthlyTotals() {
        List<Object[]> rows = climateRepo.findMonthlyTotals();

        return rows.stream()
                .filter(row -> row[0] != null && row[1] != null && row[2] != null)
                .map(row -> {
                    int  year     = ((Number) row[0]).intValue();
                    int  monthNum = ((Number) row[1]).intValue();
                    long total    = ((Number) row[2]).longValue();

                    // Skip any bad rows (month 0 means the CASE didn't match)
                    if (monthNum < 1 || monthNum > 12) return null;

                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("yearMonth",      String.format("%d-%02d", year, monthNum));
                    m.put("year",           year);
                    m.put("month",          monthNum);
                    m.put("totalGreenLeaf", total);
                    return m;
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(m -> (String) m.get("yearMonth")))
                .collect(Collectors.toList());
    }

    // ── Yearly totals for chart ───────────────────────────────────────────────
    public List<Map<String, Object>> getYearlyTotals() {
        List<Object[]> rows = climateRepo.findYearlyTotals();

        return rows.stream()
                .filter(row -> row[0] != null && row[1] != null)
                .map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("year",           ((Number) row[0]).intValue());
                    m.put("totalGreenLeaf", ((Number) row[1]).longValue());
                    return m;
                })
                .collect(Collectors.toList());
    }
}