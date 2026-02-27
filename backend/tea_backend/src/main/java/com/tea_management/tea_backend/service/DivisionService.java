package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.DivisionDTO;
import com.tea_management.tea_backend.model.Division;
import com.tea_management.tea_backend.model.Estate;
import com.tea_management.tea_backend.repository.DivisionRepository;
import com.tea_management.tea_backend.repository.EstateRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DivisionService {

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private EstateRepository estateRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create
    public DivisionDTO createDivision(DivisionDTO divisionDTO) {
        // 1. Find the Estate first
        Estate estate = estateRepository.findById(divisionDTO.getEstateId())
                .orElseThrow(() -> new RuntimeException("Estate not found with id: " + divisionDTO.getEstateId()));

        // 2. Map DTO to Division Entity
        Division division = modelMapper.map(divisionDTO, Division.class);

        // 3. Set the relationship manually to be safe
        division.setEstate(estate);

        // 4. Save
        Division savedDivision = divisionRepository.save(division);

        // 5. Convert back to DTO
        return convertToDTO(savedDivision);
    }

    // Get All
    public List<DivisionDTO> getAllDivisions() {
        return divisionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get By ID
    public DivisionDTO getDivisionById(Integer id) {
        Division division = divisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Division not found"));
        return convertToDTO(division);
    }

    // Get All Divisions by Estate ID (Optional but useful)
    public List<DivisionDTO> getDivisionsByEstateId(Integer estateId) {
        return divisionRepository.findByEstate_EstateId(estateId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update
    public DivisionDTO updateDivision(Integer id, DivisionDTO divisionDTO) {
        Division existingDivision = divisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Division not found"));

        // Update basic fields
        existingDivision.setDivisionName(divisionDTO.getDivisionName());

        // Update Estate relationship if estateId changed
        if (divisionDTO.getEstateId() != null) {
            Estate estate = estateRepository.findById(divisionDTO.getEstateId())
                    .orElseThrow(() -> new RuntimeException("Estate not found"));
            existingDivision.setEstate(estate);
        }

        Division savedDivision = divisionRepository.save(existingDivision);
        return convertToDTO(savedDivision);
    }

    // Delete
    public void deleteDivision(Integer id) {
        if (!divisionRepository.existsById(id)) {
            throw new RuntimeException("Division not found");
        }
        divisionRepository.deleteById(id);
    }

    // Helper to map Entity -> DTO manually to ensure estateId is set
    private DivisionDTO convertToDTO(Division division) {
        DivisionDTO dto = modelMapper.map(division, DivisionDTO.class);
        dto.setEstateId(division.getEstate().getEstateId());
        return dto;
    }
}