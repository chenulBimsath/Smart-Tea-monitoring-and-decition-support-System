package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "division") // Lowercase to match database
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Division {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "division_id")
    private Integer divisionId;

    @Column(name = "division_name", nullable = false, length = 100)
    private String divisionName;

    // Foreign Key Relationship
    @ManyToOne
    @JoinColumn(name = "estate_id", nullable = false)
    private Estate estate;
}