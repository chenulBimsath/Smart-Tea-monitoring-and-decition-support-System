package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.FertilizerDataDTO;
import com.tea_management.tea_backend.service.FertilizerDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fertilizer-data")
@CrossOrigin(origins = {"https://smartteamonitor.com", "http://localhost:5173"})
public class FertilizerDataController {

    @Autowired
    private FertilizerDataService fertilizerDataService;

    @PostMapping
    public ResponseEntity<FertilizerDataDTO> createFertilizerData(@RequestBody FertilizerDataDTO dto) {
        return ResponseEntity.ok(fertilizerDataService.createFertilizerData(dto));
    }

    @GetMapping
    public ResponseEntity<List<FertilizerDataDTO>> getAllFertilizerData() {
        return ResponseEntity.ok(fertilizerDataService.getAllFertilizerData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FertilizerDataDTO> getFertilizerDataById(@PathVariable Integer id) {
        return ResponseEntity.ok(fertilizerDataService.getFertilizerDataById(id));
    }

    @GetMapping("/field/{fieldNo}")
    public ResponseEntity<List<FertilizerDataDTO>> getFertilizerDataByFieldNo(@PathVariable Integer fieldNo) {
        return ResponseEntity.ok(fertilizerDataService.getFertilizerDataByFieldNo(fieldNo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FertilizerDataDTO> updateFertilizerData(@PathVariable Integer id, @RequestBody FertilizerDataDTO dto) {
        return ResponseEntity.ok(fertilizerDataService.updateFertilizerData(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFertilizerData(@PathVariable Integer id) {
        fertilizerDataService.deleteFertilizerData(id);
        return ResponseEntity.ok("Fertilizer Data deleted successfully");
    }
}