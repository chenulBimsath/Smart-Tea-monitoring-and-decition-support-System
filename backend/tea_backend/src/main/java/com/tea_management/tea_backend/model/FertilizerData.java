package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "fertilizer_data_rangala")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FertilizerData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "field_no")
    private Integer fieldNo;

    @Column(name = "tea_type", length = 50)
    private String teaType;

    @Column(name = "crop_status", length = 50)
    private String cropStatus;

    @Column(name = "fertilizer_name", length = 100)
    private String fertilizerName;

    @Column(name = "nutrient_ratio", length = 20)
    private String nutrientRatio;

    @Column(name = "quantity_per_ha")
    private Double quantityPerHa;

    @Column(name = "total_quantity_used")
    private Double totalQuantityUsed;

    @Column(name = "application_method", length = 100)
    private String applicationMethod;

    @Column(name = "weather_soil_condition", length = 100)
    private String weatherSoilCondition;

    @Column(name = "supervisor_name", length = 100)
    private String supervisorName;
}