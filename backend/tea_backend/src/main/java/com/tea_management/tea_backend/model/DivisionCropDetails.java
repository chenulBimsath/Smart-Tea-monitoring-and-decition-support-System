package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "division_crop_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DivisionCropDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "crop_id")
    private Integer cropId;

    // Foreign Key Relationship to Division
    @ManyToOne
    @JoinColumn(name = "division_id", nullable = false)
    private Division division;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false, length = 20)
    private String month;

    @Column(name = "green_leaf_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal greenLeafKg;

    @Column(name = "pluckers", nullable = false)
    private Integer pluckers;

    @Column(name = "cash_kilo", nullable = false, precision = 10, scale = 2)
    private BigDecimal cashKilo;

    @Column(name = "without_cash_avg", nullable = false, precision = 5, scale = 2)
    private BigDecimal withoutCashAvg;
}