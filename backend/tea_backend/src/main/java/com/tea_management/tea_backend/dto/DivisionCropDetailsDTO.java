package com.tea_management.tea_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DivisionCropDetailsDTO {
    private Integer cropId;
    private Integer divisionId; // To link with Division
    private Integer year;
    private String month;
    private BigDecimal greenLeafKg;
    private Integer pluckers;
    private BigDecimal cashKilo;
    private BigDecimal withoutCashAvg;
}