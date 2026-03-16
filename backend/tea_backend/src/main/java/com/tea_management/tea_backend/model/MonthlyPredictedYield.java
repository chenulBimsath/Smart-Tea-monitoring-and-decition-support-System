package com.tea_management.tea_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "monthly_predicted_yield")
public class MonthlyPredictedYield {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "division", nullable = false)
    private String division;

    @Column(name = "predicted_yield")
    private Double predictedYield;

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Integer getId()                       { return id; }
    public void setId(Integer id)                { this.id = id; }

    public Integer getYear()                     { return year; }
    public void setYear(Integer year)            { this.year = year; }

    public Integer getMonth()                    { return month; }
    public void setMonth(Integer month)          { this.month = month; }

    public String getDivision()                  { return division; }
    public void setDivision(String division)     { this.division = division; }

    public Double getPredictedYield()            { return predictedYield; }
    public void setPredictedYield(Double v)      { this.predictedYield = v; }
}
