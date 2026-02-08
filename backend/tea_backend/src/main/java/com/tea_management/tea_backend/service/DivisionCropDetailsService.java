package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.DivisionCropDetailsDTO;
import com.tea_management.tea_backend.model.Division;
import com.tea_management.tea_backend.model.DivisionCropDetails;
import com.tea_management.tea_backend.repository.DivisionCropDetailsRepository;
import com.tea_management.tea_backend.repository.DivisionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DivisionCropDetailsService {

    @Autowired
    private DivisionCropDetailsRepository cropDetailsRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create
    public DivisionCropDetailsDTO createCropDetails(DivisionCropDetailsDTO dto) {
        // 1. Fetch the Division entity
        Division division = divisionRepository.findById(dto.getDivisionId())
                .orElseThrow(() -> new RuntimeException("Division not found with id: " + dto.getDivisionId()));

        // 2. Map DTO to Entity
        DivisionCropDetails entity = modelMapper.map(dto, DivisionCropDetails.class);

        // 3. Set relationship
        entity.setDivision(division);

        // 4. Save
        DivisionCropDetails savedEntity = cropDetailsRepository.save(entity);
        return convertToDTO(savedEntity);
    }

    // Get All
    public List<DivisionCropDetailsDTO> getAllCropDetails() {
        return cropDetailsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get By ID
    public DivisionCropDetailsDTO getCropDetailsById(Integer id) {
        DivisionCropDetails entity = cropDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop Details not found with id: " + id));
        return convertToDTO(entity);
    }

    // Get By Division ID
    public List<DivisionCropDetailsDTO> getCropDetailsByDivisionId(Integer divisionId) {
        return cropDetailsRepository.findByDivision_DivisionId(divisionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update
    public DivisionCropDetailsDTO updateCropDetails(Integer id, DivisionCropDetailsDTO dto) {
        DivisionCropDetails existingEntity = cropDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop Details not found with id: " + id));

        // Update basic fields
        existingEntity.setYear(dto.getYear());
        existingEntity.setMonth(dto.getMonth());
        existingEntity.setGreenLeafKg(dto.getGreenLeafKg());
        existingEntity.setPluckers(dto.getPluckers());
        existingEntity.setCashKilo(dto.getCashKilo());
        existingEntity.setWithoutCashAvg(dto.getWithoutCashAvg());

        // Update Division if changed
        if (dto.getDivisionId() != null && !dto.getDivisionId().equals(existingEntity.getDivision().getDivisionId())) {
            Division division = divisionRepository.findById(dto.getDivisionId())
                    .orElseThrow(() -> new RuntimeException("Division not found with id: " + dto.getDivisionId()));
            existingEntity.setDivision(division);
        }

        DivisionCropDetails savedEntity = cropDetailsRepository.save(existingEntity);
        return convertToDTO(savedEntity);
    }

    // Delete
    public void deleteCropDetails(Integer id) {
        if (!cropDetailsRepository.existsById(id)) {
            throw new RuntimeException("Crop Details not found with id: " + id);
        }
        cropDetailsRepository.deleteById(id);
    }

    private DivisionCropDetailsDTO convertToDTO(DivisionCropDetails entity) {
        DivisionCropDetailsDTO dto = modelMapper.map(entity, DivisionCropDetailsDTO.class);
        dto.setDivisionId(entity.getDivision().getDivisionId());
        return dto;
    }
}