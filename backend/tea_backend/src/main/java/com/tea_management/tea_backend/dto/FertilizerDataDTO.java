package com.tea_management.tea_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FertilizerDataDTO {
    private Integer id;
    private LocalDate applicationDate;
    private Integer fieldNo;
    private String teaType;
    private String cropStatus;
    private String fertilizerName;
    private String nutrientRatio;
    private Double quantityPerHa;
    private Double totalQuantityUsed;
    private String applicationMethod;
    private String weatherSoilCondition;
    private String supervisorName;
}