package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.model.MonthlyPredictedYield;
import com.tea_management.tea_backend.service.YieldPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for the Yield Prediction page.
 *
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/controller/YieldPredictionController.java
 *
 * Endpoints:
 *   GET /api/yield/predictions      → latest ML prediction per division
 *   GET /api/yield/history/monthly  → monthly totals from division_ndvi_climate
 *   GET /api/yield/history/yearly   → yearly totals from division_ndvi_climate
 */
@RestController
@RequestMapping("/api/yield")
@CrossOrigin(origins = "*")
public class YieldPredictionController {

    private final YieldPredictionService service;

    public YieldPredictionController(YieldPredictionService service) {
        this.service = service;
    }

    /**
     * GET /api/yield/predictions
     * Latest predicted yield per division from monthly_predicted_yield table.
     * Written by yield_prediction_ml.py on schedule.
     */
    @GetMapping("/predictions")
    public ResponseEntity<List<MonthlyPredictedYield>> getPredictions() {
        return ResponseEntity.ok(service.getLatestPredictions());
    }

    /**
     * GET /api/yield/history/monthly
     * Monthly green_leaf totals (all divisions) for the bar chart.
     * Source: division_ndvi_climate
     */
    @GetMapping("/history/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyHistory() {
        return ResponseEntity.ok(service.getMonthlyTotals());
    }

    /**
     * GET /api/yield/history/yearly
     * Yearly green_leaf totals for the yearly chart tab.
     * Source: division_ndvi_climate
     */
    @GetMapping("/history/yearly")
    public ResponseEntity<List<Map<String, Object>>> getYearlyHistory() {
        return ResponseEntity.ok(service.getYearlyTotals());
    }
}
