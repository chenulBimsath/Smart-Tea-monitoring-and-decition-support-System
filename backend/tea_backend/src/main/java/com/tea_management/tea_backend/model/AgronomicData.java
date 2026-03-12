package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "agronomic_data_rangala")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgronomicData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "inspection_date")
    private LocalDate inspectionDate;

    @Column(name = "field_no", length = 50)
    private String fieldNo;

    @Column(name = "clone_type", length = 100)
    private String cloneType;

    @Column(name = "pruning_year", length = 50)
    private String pruningYear;

    @Column(name = "plucking_interval")
    private Integer pluckingInterval;

    @Column(name = "leaf_quality")
    private Double leafQuality;

    @Column(name = "rainfall")
    private Double rainfall;

    @Column(name = "soil_ph")
    private Double soilPh;

    @Column(name = "pest_disease", length = 255)
    private String pestDisease;

    @Column(name = "weed_density", length = 50)
    private String weedDensity;

    @Column(name = "shade_tree", length = 100)
    private String shadeTree;

    @Column(name = "inspected_by", length = 150)
    private String inspectedBy;
}