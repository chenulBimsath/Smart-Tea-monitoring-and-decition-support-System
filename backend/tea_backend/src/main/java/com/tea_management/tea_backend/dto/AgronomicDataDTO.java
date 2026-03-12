package com.tea_management.tea_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AgronomicDataDTO {
    private Integer id;
    private LocalDate inspectionDate;
    private String fieldNo;
    private String cloneType;
    private String pruningYear;
    private Integer pluckingInterval;
    private Double leafQuality;
    private Double rainfall;
    private Double soilPh;
    private String pestDisease;
    private String weedDensity;
    private String shadeTree;
    private String inspectedBy;
}