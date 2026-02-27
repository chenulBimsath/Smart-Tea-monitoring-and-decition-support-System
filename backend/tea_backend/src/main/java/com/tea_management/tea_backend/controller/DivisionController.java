package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.DivisionDTO;
import com.tea_management.tea_backend.service.DivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/divisions")
@CrossOrigin(origins = "*")
public class DivisionController {

    @Autowired
    private DivisionService divisionService;

    @PostMapping
    public ResponseEntity<DivisionDTO> createDivision(@RequestBody DivisionDTO divisionDTO) {
        return ResponseEntity.ok(divisionService.createDivision(divisionDTO));
    }

    @GetMapping
    public ResponseEntity<List<DivisionDTO>> getAllDivisions() {
        return ResponseEntity.ok(divisionService.getAllDivisions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DivisionDTO> getDivisionById(@PathVariable Integer id) {
        return ResponseEntity.ok(divisionService.getDivisionById(id));
    }

    // Extra endpoint: Get divisions belonging to a specific Estate
    // Usage: /api/divisions/estate/1
    @GetMapping("/estate/{estateId}")
    public ResponseEntity<List<DivisionDTO>> getDivisionsByEstate(@PathVariable Integer estateId) {
        return ResponseEntity.ok(divisionService.getDivisionsByEstateId(estateId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DivisionDTO> updateDivision(@PathVariable Integer id, @RequestBody DivisionDTO divisionDTO) {
        return ResponseEntity.ok(divisionService.updateDivision(id, divisionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDivision(@PathVariable Integer id) {
        divisionService.deleteDivision(id);
        return ResponseEntity.ok("Division deleted successfully");
    }
}