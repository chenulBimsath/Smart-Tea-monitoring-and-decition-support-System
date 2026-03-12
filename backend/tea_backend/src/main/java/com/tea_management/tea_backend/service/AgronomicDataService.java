package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.AgronomicDataDTO;
import com.tea_management.tea_backend.model.AgronomicData;
import com.tea_management.tea_backend.repository.AgronomicDataRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AgronomicDataService {

    @Autowired
    private AgronomicDataRepository agronomicDataRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create
    public AgronomicDataDTO createAgronomicData(AgronomicDataDTO dto) {
        AgronomicData agronomicData = modelMapper.map(dto, AgronomicData.class);
        AgronomicData savedData = agronomicDataRepository.save(agronomicData);
        return modelMapper.map(savedData, AgronomicDataDTO.class);
    }

    // Get All
    public List<AgronomicDataDTO> getAllAgronomicData() {
        return agronomicDataRepository.findAll().stream()
                .map(data -> modelMapper.map(data, AgronomicDataDTO.class))
                .collect(Collectors.toList());
    }

    // Get By ID
    public AgronomicDataDTO getAgronomicDataById(Integer id) {
        AgronomicData agronomicData = agronomicDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agronomic Data not found with id: " + id));
        return modelMapper.map(agronomicData, AgronomicDataDTO.class);
    }

    // Get By Field Number
    public List<AgronomicDataDTO> getAgronomicDataByFieldNo(String fieldNo) {
        return agronomicDataRepository.findByFieldNo(fieldNo).stream()
                .map(data -> modelMapper.map(data, AgronomicDataDTO.class))
                .collect(Collectors.toList());
    }

    // Update
    public AgronomicDataDTO updateAgronomicData(Integer id, AgronomicDataDTO dto) {
        AgronomicData existingData = agronomicDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agronomic Data not found with id: " + id));

        // Update fields
        existingData.setInspectionDate(dto.getInspectionDate());
        existingData.setFieldNo(dto.getFieldNo());
        existingData.setCloneType(dto.getCloneType());
        existingData.setPruningYear(dto.getPruningYear());
        existingData.setPluckingInterval(dto.getPluckingInterval());
        existingData.setLeafQuality(dto.getLeafQuality());
        existingData.setRainfall(dto.getRainfall());
        existingData.setSoilPh(dto.getSoilPh());
        existingData.setPestDisease(dto.getPestDisease());
        existingData.setWeedDensity(dto.getWeedDensity());
        existingData.setShadeTree(dto.getShadeTree());
        existingData.setInspectedBy(dto.getInspectedBy());

        AgronomicData savedData = agronomicDataRepository.save(existingData);
        return modelMapper.map(savedData, AgronomicDataDTO.class);
    }

    // Delete
    public void deleteAgronomicData(Integer id) {
        if (!agronomicDataRepository.existsById(id)) {
            throw new RuntimeException("Agronomic Data not found with id: " + id);
        }
        agronomicDataRepository.deleteById(id);
    }
}