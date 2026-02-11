package com.tea_management.tea_backend.service;
import org.modelmapper.ModelMapper;
import com.tea_management.tea_backend.dto.EstateDTO;
import com.tea_management.tea_backend.model.Estate;
import com.tea_management.tea_backend.repository.EstateRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EstateService {

    @Autowired
    private EstateRepository estateRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<EstateDTO> getAllEstates() {
        List<Estate> estates = estateRepository.findAll();
        return estates.stream()
                .map(estate -> modelMapper.map(estate, EstateDTO.class))
                .collect(Collectors.toList());
    }

    public EstateDTO createEstate(EstateDTO estateDTO) {
        // 1. Map DTO to Entity
        Estate estate = modelMapper.map(estateDTO, Estate.class);
        // 2. Save
        Estate savedEstate = estateRepository.save(estate);
        // 3. Map back to DTO
        return modelMapper.map(savedEstate, EstateDTO.class);
    }

    public EstateDTO updateEstate(EstateDTO estateDTO) {
        Estate estate = modelMapper.map(estateDTO, Estate.class);
        Estate savedEstate = estateRepository.save(estate);
        return modelMapper.map(savedEstate, EstateDTO.class);
    }

    // Kept this because your Controller needs it for GET /api/estates/{id}
    public EstateDTO getEstateById(Integer id) {
        Estate estate = estateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estate not found"));
        return modelMapper.map(estate, EstateDTO.class);
    }

    public String deleteEstate(EstateDTO estateDTO) {
        estateRepository.delete(modelMapper.map(estateDTO, Estate.class));
        return "Estate deleted";
    }

    // Optional: Overload to keep your Controller working if it passes ID
    public String deleteEstate(Integer id) {
        estateRepository.deleteById(id);
        return "Estate deleted";
    }
}