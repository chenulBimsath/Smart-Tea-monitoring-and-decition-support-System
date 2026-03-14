package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Maps to: public.division_ndvi_climate
 *
 * This is the main historical training data table.
 * React uses this for the yield history chart.
 *
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/model/DivisionNdviClimate.java
 */
@Entity
@Table(name = "division_ndvi_climate")
public class DivisionNdviClimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ndviId;

    @Column(name = "estate_id")
    private Integer estateId;

    @Column(name = "division_id")
    private Integer divisionId;

    @Column(name = "year")
    private Integer year;

    @Column(name = "month")
    private String month;

    @Column(name = "green_leaf")
    private Double greenLeaf;

    @Column(name = "pluckers")
    private Double pluckers;

    @Column(name = "avg_temperature")
    private Double avgTemperature;

    @Column(name = "avg_rainfall")
    private Double avgRainfall;

    @Column(name = "avg_humidity")
    private Double avgHumidity;

    @Column(name = "ndvi_avg")
    private Double ndviAvg;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Integer getNdviId()                   { return ndviId; }
    public void setNdviId(Integer v)             { this.ndviId = v; }

    public Integer getEstateId()                 { return estateId; }
    public void setEstateId(Integer v)           { this.estateId = v; }

    public Integer getDivisionId()               { return divisionId; }
    public void setDivisionId(Integer v)         { this.divisionId = v; }

    public Integer getYear()                     { return year; }
    public void setYear(Integer v)               { this.year = v; }

    public String getMonth()                     { return month; }
    public void setMonth(String v)               { this.month = v; }

    public Double getGreenLeaf()                 { return greenLeaf; }
    public void setGreenLeaf(Double v)           { this.greenLeaf = v; }

    public Double getPluckers()                  { return pluckers; }
    public void setPluckers(Double v)            { this.pluckers = v; }

    public Double getAvgTemperature()            { return avgTemperature; }
    public void setAvgTemperature(Double v)      { this.avgTemperature = v; }

    public Double getAvgRainfall()               { return avgRainfall; }
    public void setAvgRainfall(Double v)         { this.avgRainfall = v; }

    public Double getAvgHumidity()               { return avgHumidity; }
    public void setAvgHumidity(Double v)         { this.avgHumidity = v; }

    public Double getNdviAvg()                   { return ndviAvg; }
    public void setNdviAvg(Double v)             { this.ndviAvg = v; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }
}
