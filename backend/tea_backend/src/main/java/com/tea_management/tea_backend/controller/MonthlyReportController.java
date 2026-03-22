package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.MonthlyReportDTO;
import com.tea_management.tea_backend.service.MonthlyReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = {"https://smartteamonitor.com", "http://localhost:5173"})
public class MonthlyReportController {

    private final MonthlyReportService service;

    public MonthlyReportController(MonthlyReportService service) {
        this.service = service;
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyReportDTO> getMonthlyReport(
        @RequestParam int year,
        @RequestParam int month
    ) {
        return ResponseEntity.ok(service.buildReport(year, month));
    }

    @GetMapping("/monthly/previous")
    public ResponseEntity<MonthlyReportDTO> getPreviousMonthReport() {
        LocalDate prev  = LocalDate.now().minusMonths(1);
        return ResponseEntity.ok(service.buildReport(prev.getYear(), prev.getMonthValue()));
    }
}
