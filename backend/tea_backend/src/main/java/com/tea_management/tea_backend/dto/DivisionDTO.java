package com.tea_management.tea_backend.dto;

import lombok.Data;

@Data
public class DivisionDTO {
    private Integer divisionId;
    private String divisionName;
    private Integer estateId; // We only need the ID for the API
}