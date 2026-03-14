package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.FertilizerDataDTO;
import com.tea_management.tea_backend.model.FertilizerData;
import com.tea_management.tea_backend.repository.FertilizerDataRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FertilizerDataService {

    @Autowired
    private FertilizerDataRepository fertilizerDataRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create
    public FertilizerDataDTO createFertilizerData(FertilizerDataDTO dto) {
        FertilizerData fertilizerData = modelMapper.map(dto, FertilizerData.class);
        FertilizerData savedData = fertilizerDataRepository.save(fertilizerData);
        return modelMapper.map(savedData, FertilizerDataDTO.class);
    }

    // Get All
    public List<FertilizerDataDTO> getAllFertilizerData() {
        return fertilizerDataRepository.findAll().stream()
                .map(data -> modelMapper.map(data, FertilizerDataDTO.class))
                .collect(Collectors.toList());
    }

    // Get By ID
    public FertilizerDataDTO getFertilizerDataById(Integer id) {
        FertilizerData fertilizerData = fertilizerDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fertilizer Data not found with id: " + id));
        return modelMapper.map(fertilizerData, FertilizerDataDTO.class);
    }

    // Get By Field Number
    public List<FertilizerDataDTO> getFertilizerDataByFieldNo(Integer fieldNo) {
        return fertilizerDataRepository.findByFieldNo(fieldNo).stream()
                .map(data -> modelMapper.map(data, FertilizerDataDTO.class))
                .collect(Collectors.toList());
    }

    // Update
    public FertilizerDataDTO updateFertilizerData(Integer id, FertilizerDataDTO dto) {
        FertilizerData existingData = fertilizerDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fertilizer Data not found with id: " + id));

        // Update fields
        existingData.setApplicationDate(dto.getApplicationDate());
        existingData.setFieldNo(dto.getFieldNo());
        existingData.setTeaType(dto.getTeaType());
        existingData.setCropStatus(dto.getCropStatus());
        existingData.setFertilizerName(dto.getFertilizerName());
        existingData.setNutrientRatio(dto.getNutrientRatio());
        existingData.setQuantityPerHa(dto.getQuantityPerHa());
        existingData.setTotalQuantityUsed(dto.getTotalQuantityUsed());
        existingData.setApplicationMethod(dto.getApplicationMethod());
        existingData.setWeatherSoilCondition(dto.getWeatherSoilCondition());
        existingData.setSupervisorName(dto.getSupervisorName());

        FertilizerData savedData = fertilizerDataRepository.save(existingData);
        return modelMapper.map(savedData, FertilizerDataDTO.class);
    }

    // Delete
    public void deleteFertilizerData(Integer id) {
        if (!fertilizerDataRepository.existsById(id)) {
            throw new RuntimeException("Fertilizer Data not found with id: " + id);
        }
        fertilizerDataRepository.deleteById(id);
    }
}