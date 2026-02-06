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

    @PostMapping
    public ResponseEntity<EstateDTO> createEstate(@RequestBody EstateDTO estateDTO) {
        return ResponseEntity.ok(estateService.createEstate(estateDTO));
    }

    @GetMapping
    public ResponseEntity<List<EstateDTO>> getAllEstates() {
        return ResponseEntity.ok(estateService.getAllEstates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstateDTO> getEstateById(@PathVariable Integer id) {
        return ResponseEntity.ok(estateService.getEstateById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstateDTO> updateEstate(@PathVariable Integer id, @RequestBody EstateDTO estateDTO) {
        return ResponseEntity.ok(estateService.updateEstate(id, estateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEstate(@PathVariable Integer id) {
        estateService.deleteEstate(id);
        return ResponseEntity.ok("Estate deleted successfully");
    }
}