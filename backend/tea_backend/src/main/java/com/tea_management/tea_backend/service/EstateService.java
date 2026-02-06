package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.EstateDTO;
import com.tea_management.tea_backend.model.Estate;
import com.tea_management.tea_backend.repository.EstateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstateService {

    @Autowired
    private EstateRepository estateRepository;

    // Create
    public EstateDTO createEstate(EstateDTO estateDTO) {
        Estate estate = new Estate();
        estate.setEstateName(estateDTO.getEstateName());

        Estate savedEstate = estateRepository.save(estate);
        return convertToDTO(savedEstate);
    }

    // Helper: Entity -> DTO
    private EstateDTO convertToDTO(Estate estate) {
        EstateDTO dto = new EstateDTO();
        dto.setEstateId(estate.getEstateId());
        dto.setEstateName(estate.getEstateName());
        return dto;
    }
}