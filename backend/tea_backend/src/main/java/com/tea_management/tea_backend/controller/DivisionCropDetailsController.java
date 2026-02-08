package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.DivisionCropDetailsDTO;
import com.tea_management.tea_backend.service.DivisionCropDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crop-details")
@CrossOrigin(origins = "*")
public class DivisionCropDetailsController {

    @Autowired
    private DivisionCropDetailsService cropDetailsService;

    @PostMapping
    public ResponseEntity<DivisionCropDetailsDTO> createCropDetails(@RequestBody DivisionCropDetailsDTO dto) {
        return ResponseEntity.ok(cropDetailsService.createCropDetails(dto));
    }

    @GetMapping
    public ResponseEntity<List<DivisionCropDetailsDTO>> getAllCropDetails() {
        return ResponseEntity.ok(cropDetailsService.getAllCropDetails());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DivisionCropDetailsDTO> getCropDetailsById(@PathVariable Integer id) {
        return ResponseEntity.ok(cropDetailsService.getCropDetailsById(id));
    }

    @GetMapping("/division/{divisionId}")
    public ResponseEntity<List<DivisionCropDetailsDTO>> getCropDetailsByDivisionId(@PathVariable Integer divisionId) {
        return ResponseEntity.ok(cropDetailsService.getCropDetailsByDivisionId(divisionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DivisionCropDetailsDTO> updateCropDetails(@PathVariable Integer id, @RequestBody DivisionCropDetailsDTO dto) {
        return ResponseEntity.ok(cropDetailsService.updateCropDetails(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCropDetails(@PathVariable Integer id) {
        cropDetailsService.deleteCropDetails(id);
        return ResponseEntity.ok("Crop Details deleted successfully");
    }
}