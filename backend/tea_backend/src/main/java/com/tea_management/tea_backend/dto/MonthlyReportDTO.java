package com.tea_management.tea_backend.dto;

import java.util.List;
import java.util.Map;


public class MonthlyReportDTO {

    // ── Meta ──────────────────────────────────────────────────────────────────
    private String  estateName;
    private int     year;
    private int     month;
    private String  monthName;
    private String  generatedAt;

    // ── Yield summary ─────────────────────────────────────────────────────────
    private Double  totalActualYield;       // kg — sum across all divisions (division_ndvi_climate)
    private Double  totalPredictedYield;    // kg — sum from monthly_predicted_yield
    private Double  yieldVariance;          // actual - predicted
    private Double  yieldVariancePct;       // %

    // ── Per-division yield ────────────────────────────────────────────────────
    private List<Map<String, Object>> divisionYield;
    // [{divisionName, actual, predicted, variance, pluckers, ndvi, cashKilo}]

    // ── Climate / weather ─────────────────────────────────────────────────────
    private Double  avgTemperature;
    private Double  avgRainfall;
    private Double  avgHumidity;
    private Double  avgNdvi;
    private List<Map<String, Object>> dailyWeather;
    // [{date, temperature, rainfall, humidity, ndviValue}]

    // ── Financial ─────────────────────────────────────────────────────────────
    private Double  totalRevenue;           // from financial_data_rangala
    private Double  totalExpenses;
    private Double  netProfitLoss;
    private Double  pluckingCost;           // from financial_performance
    private Double  nsa;                    // net sales average
    private Double  cop;                    // cost of production
    private List<Map<String, Object>> financialTransactions;
    // [{category, transactionType, totalAmount}]

    // ── Fertilizer ────────────────────────────────────────────────────────────
    private Double  totalFertilizerKg;
    private List<Map<String, Object>> fertilizerApplications;
    // [{fertilizerType, quantityKg, division, yphMonth}]

    // ── Agronomic ─────────────────────────────────────────────────────────────
    private Double  avgLeafQuality;
    private Double  avgSoilPh;
    private List<Map<String, Object>> agronomicData;
    // [{fieldNo, cloneType, leafQuality, soilPh, pestDisease, weedDensity}]

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public String getEstateName()                              { return estateName; }
    public void   setEstateName(String v)                     { this.estateName = v; }

    public int    getYear()                                    { return year; }
    public void   setYear(int v)                              { this.year = v; }

    public int    getMonth()                                   { return month; }
    public void   setMonth(int v)                             { this.month = v; }

    public String getMonthName()                               { return monthName; }
    public void   setMonthName(String v)                      { this.monthName = v; }

    public String getGeneratedAt()                             { return generatedAt; }
    public void   setGeneratedAt(String v)                    { this.generatedAt = v; }

    public Double getTotalActualYield()                        { return totalActualYield; }
    public void   setTotalActualYield(Double v)               { this.totalActualYield = v; }

    public Double getTotalPredictedYield()                     { return totalPredictedYield; }
    public void   setTotalPredictedYield(Double v)            { this.totalPredictedYield = v; }

    public Double getYieldVariance()                           { return yieldVariance; }
    public void   setYieldVariance(Double v)                  { this.yieldVariance = v; }

    public Double getYieldVariancePct()                        { return yieldVariancePct; }
    public void   setYieldVariancePct(Double v)               { this.yieldVariancePct = v; }

    public List<Map<String, Object>> getDivisionYield()        { return divisionYield; }
    public void   setDivisionYield(List<Map<String, Object>> v){ this.divisionYield = v; }

    public Double getAvgTemperature()                          { return avgTemperature; }
    public void   setAvgTemperature(Double v)                 { this.avgTemperature = v; }

    public Double getAvgRainfall()                             { return avgRainfall; }
    public void   setAvgRainfall(Double v)                    { this.avgRainfall = v; }

    public Double getAvgHumidity()                             { return avgHumidity; }
    public void   setAvgHumidity(Double v)                    { this.avgHumidity = v; }

    public Double getAvgNdvi()                                 { return avgNdvi; }
    public void   setAvgNdvi(Double v)                        { this.avgNdvi = v; }

    public List<Map<String, Object>> getDailyWeather()         { return dailyWeather; }
    public void   setDailyWeather(List<Map<String, Object>> v){ this.dailyWeather = v; }

    public Double getTotalRevenue()                            { return totalRevenue; }
    public void   setTotalRevenue(Double v)                   { this.totalRevenue = v; }

    public Double getTotalExpenses()                           { return totalExpenses; }
    public void   setTotalExpenses(Double v)                  { this.totalExpenses = v; }

    public Double getNetProfitLoss()                           { return netProfitLoss; }
    public void   setNetProfitLoss(Double v)                  { this.netProfitLoss = v; }

    public Double getPluckingCost()                            { return pluckingCost; }
    public void   setPluckingCost(Double v)                   { this.pluckingCost = v; }

    public Double getNsa()                                     { return nsa; }
    public void   setNsa(Double v)                            { this.nsa = v; }

    public Double getCop()                                     { return cop; }
    public void   setCop(Double v)                            { this.cop = v; }

    public List<Map<String, Object>> getFinancialTransactions()          { return financialTransactions; }
    public void   setFinancialTransactions(List<Map<String, Object>> v)  { this.financialTransactions = v; }

    public Double getTotalFertilizerKg()                       { return totalFertilizerKg; }
    public void   setTotalFertilizerKg(Double v)              { this.totalFertilizerKg = v; }

    public List<Map<String, Object>> getFertilizerApplications()         { return fertilizerApplications; }
    public void   setFertilizerApplications(List<Map<String, Object>> v){ this.fertilizerApplications = v; }

    public Double getAvgLeafQuality()                          { return avgLeafQuality; }
    public void   setAvgLeafQuality(Double v)                 { this.avgLeafQuality = v; }

    public Double getAvgSoilPh()                               { return avgSoilPh; }
    public void   setAvgSoilPh(Double v)                      { this.avgSoilPh = v; }

    public List<Map<String, Object>> getAgronomicData()        { return agronomicData; }
    public void   setAgronomicData(List<Map<String, Object>> v){ this.agronomicData = v; }
}
