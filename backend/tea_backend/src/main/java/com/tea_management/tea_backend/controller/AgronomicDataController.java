package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.AgronomicDataDTO;
import com.tea_management.tea_backend.service.AgronomicDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agronomic-data")
@CrossOrigin(origins = "*")
public class AgronomicDataController {

    @Autowired
    private AgronomicDataService agronomicDataService;

    @PostMapping
    public ResponseEntity<AgronomicDataDTO> createAgronomicData(@RequestBody AgronomicDataDTO dto) {
        return ResponseEntity.ok(agronomicDataService.createAgronomicData(dto));
    }

    @GetMapping
    public ResponseEntity<List<AgronomicDataDTO>> getAllAgronomicData() {
        return ResponseEntity.ok(agronomicDataService.getAllAgronomicData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgronomicDataDTO> getAgronomicDataById(@PathVariable Integer id) {
        return ResponseEntity.ok(agronomicDataService.getAgronomicDataById(id));
    }

    @GetMapping("/field/{fieldNo}")
    public ResponseEntity<List<AgronomicDataDTO>> getAgronomicDataByFieldNo(@PathVariable String fieldNo) {
        return ResponseEntity.ok(agronomicDataService.getAgronomicDataByFieldNo(fieldNo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgronomicDataDTO> updateAgronomicData(@PathVariable Integer id, @RequestBody AgronomicDataDTO dto) {
        return ResponseEntity.ok(agronomicDataService.updateAgronomicData(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAgronomicData(@PathVariable Integer id) {
        agronomicDataService.deleteAgronomicData(id);
        return ResponseEntity.ok("Agronomic Data deleted successfully");
    }
}
