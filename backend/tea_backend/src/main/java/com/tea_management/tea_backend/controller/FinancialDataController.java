package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.FinancialDataDTO;
import com.tea_management.tea_backend.service.FinancialDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financial-data")
@CrossOrigin(origins = "*")
public class FinancialDataController {

    @Autowired
    private FinancialDataService financialDataService;

    @PostMapping
    public ResponseEntity<FinancialDataDTO> createFinancialData(@RequestBody FinancialDataDTO dto) {
        return ResponseEntity.ok(financialDataService.createFinancialData(dto));
    }

    @GetMapping
    public ResponseEntity<List<FinancialDataDTO>> getAllFinancialData() {
        return ResponseEntity.ok(financialDataService.getAllFinancialData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialDataDTO> getFinancialDataById(@PathVariable Integer id) {
        return ResponseEntity.ok(financialDataService.getFinancialDataById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FinancialDataDTO>> getFinancialDataByCategory(@PathVariable String category) {
        return ResponseEntity.ok(financialDataService.getFinancialDataByCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialDataDTO> updateFinancialData(@PathVariable Integer id, @RequestBody FinancialDataDTO dto) {
        return ResponseEntity.ok(financialDataService.updateFinancialData(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFinancialData(@PathVariable Integer id) {
        financialDataService.deleteFinancialData(id);
        return ResponseEntity.ok("Financial Data deleted successfully");
    }
}