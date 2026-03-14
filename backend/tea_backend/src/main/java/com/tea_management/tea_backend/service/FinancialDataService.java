package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.FinancialDataDTO;
import com.tea_management.tea_backend.model.FinancialData;
import com.tea_management.tea_backend.repository.FinancialDataRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FinancialDataService {

    @Autowired
    private FinancialDataRepository financialDataRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create
    public FinancialDataDTO createFinancialData(FinancialDataDTO dto) {
        FinancialData financialData = modelMapper.map(dto, FinancialData.class);
        FinancialData savedData = financialDataRepository.save(financialData);
        return modelMapper.map(savedData, FinancialDataDTO.class);
    }

    // Get All
    public List<FinancialDataDTO> getAllFinancialData() {
        return financialDataRepository.findAll().stream()
                .map(data -> modelMapper.map(data, FinancialDataDTO.class))
                .collect(Collectors.toList());
    }

    // Get By ID
    public FinancialDataDTO getFinancialDataById(Integer id) {
        FinancialData financialData = financialDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial Data not found with id: " + id));
        return modelMapper.map(financialData, FinancialDataDTO.class);
    }

    // Get By Category
    public List<FinancialDataDTO> getFinancialDataByCategory(String category) {
        return financialDataRepository.findByCategory(category).stream()
                .map(data -> modelMapper.map(data, FinancialDataDTO.class))
                .collect(Collectors.toList());
    }

    // Update
    public FinancialDataDTO updateFinancialData(Integer id, FinancialDataDTO dto) {
        FinancialData existingData = financialDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial Data not found with id: " + id));

        // Update fields manually as per your previous pattern
        existingData.setTransactionDate(dto.getTransactionDate());
        existingData.setTransactionType(dto.getTransactionType());
        existingData.setCategory(dto.getCategory());
        existingData.setDescriptionDetails(dto.getDescriptionDetails());
        existingData.setQuantity(dto.getQuantity());
        existingData.setUnitPriceRate(dto.getUnitPriceRate());
        existingData.setTotalAmount(dto.getTotalAmount());
        existingData.setPaymentMethod(dto.getPaymentMethod());
        existingData.setVoucherInvoiceRef(dto.getVoucherInvoiceRef());
        existingData.setAuthorizedBy(dto.getAuthorizedBy());

        FinancialData savedData = financialDataRepository.save(existingData);
        return modelMapper.map(savedData, FinancialDataDTO.class);
    }

    // Delete
    public void deleteFinancialData(Integer id) {
        if (!financialDataRepository.existsById(id)) {
            throw new RuntimeException("Financial Data not found with id: " + id);
        }
        financialDataRepository.deleteById(id);
    }
}