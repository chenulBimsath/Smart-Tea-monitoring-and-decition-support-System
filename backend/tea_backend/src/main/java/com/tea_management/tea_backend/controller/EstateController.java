package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.EstateDTO;
import com.tea_management.tea_backend.service.EstateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estates")
@CrossOrigin(origins = "*")
public class EstateController {

    @Autowired
    private EstateService estateService;

    // Create
    @PostMapping
    public ResponseEntity<EstateDTO> createEstate(@RequestBody EstateDTO estateDTO) {
        return ResponseEntity.ok(estateService.createEstate(estateDTO));
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<EstateDTO>> getAllEstates() {
        return ResponseEntity.ok(estateService.getAllEstates());
    }

    // Read One
    @GetMapping("/{id}")
    public ResponseEntity<EstateDTO> getEstateById(@PathVariable Integer id) {
        return ResponseEntity.ok(estateService.getEstateById(id));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<EstateDTO> updateEstate(@PathVariable Integer id, @RequestBody EstateDTO estateDTO) {
        // Important: We set the ID from the path into the DTO so the Service knows which row to update
        estateDTO.setEstateId(id);
        return ResponseEntity.ok(estateService.updateEstate(estateDTO));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEstate(@PathVariable Integer id) {
        String response = estateService.deleteEstate(id);
        return ResponseEntity.ok(response);
    }
}