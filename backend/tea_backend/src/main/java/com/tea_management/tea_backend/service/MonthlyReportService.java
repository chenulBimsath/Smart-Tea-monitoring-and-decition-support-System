package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.MonthlyReportDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
public class MonthlyReportService {

    private final JdbcTemplate db;

    private static final String[] MONTH_NAMES = {
        "", "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    };

    // Month names stored as text in division_ndvi_climate
    private static final Map<Integer, String[]> MONTH_VARIANTS = new HashMap<>();
    static {
        MONTH_VARIANTS.put(1,  new String[]{"January","Jan"});
        MONTH_VARIANTS.put(2,  new String[]{"February","Feb"});
        MONTH_VARIANTS.put(3,  new String[]{"March","Mar"});
        MONTH_VARIANTS.put(4,  new String[]{"April","Apr"});
        MONTH_VARIANTS.put(5,  new String[]{"May"});
        MONTH_VARIANTS.put(6,  new String[]{"June","Jun"});
        MONTH_VARIANTS.put(7,  new String[]{"July","Jul"});
        MONTH_VARIANTS.put(8,  new String[]{"August","Aug"});
        MONTH_VARIANTS.put(9,  new String[]{"September","Sep"});
        MONTH_VARIANTS.put(10, new String[]{"October","Oct"});
        MONTH_VARIANTS.put(11, new String[]{"November","Nov"});
        MONTH_VARIANTS.put(12, new String[]{"December","Dec"});
    }

    public MonthlyReportService(JdbcTemplate db) {
        this.db = db;
    }

    public MonthlyReportDTO buildReport(int year, int month) {
        MonthlyReportDTO report = new MonthlyReportDTO();
        report.setYear(year);
        report.setMonth(month);
        report.setMonthName(MONTH_NAMES[month]);
        report.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

        // Estate name
        try {
            String estateName = db.queryForObject(
                "SELECT estate_name FROM estate LIMIT 1", String.class);
            report.setEstateName(estateName);
        } catch (Exception e) { report.setEstateName("Rangala Estate"); }

        // Build month IN clause — e.g. "january","jan"
        String[] variants     = buildMonthVariants(month);
        String   inClause     = buildInClause(variants.length);  // (?,?,...)
        Object[] yieldParams  = buildParams(year, variants);
        Object[] cropParams   = buildParams(year, variants);
        Object[] fertParams   = buildParams(year, variants);

        // ── 1. Yield: division_ndvi_climate ───────────────────────────────────
        String yieldSql =
            "SELECT d.division_name, nc.green_leaf, nc.pluckers, " +
            "       nc.avg_temperature, nc.avg_rainfall, nc.avg_humidity, nc.ndvi_avg " +
            "FROM division_ndvi_climate nc " +
            "JOIN division d ON d.division_id = nc.division_id " +
            "WHERE nc.year = ? AND LOWER(TRIM(nc.month)) IN " + inClause +
            " ORDER BY d.division_name";
        List<Map<String, Object>> ncRows = db.queryForList(yieldSql, yieldParams);

        // ── 2. Predicted yield: monthly_predicted_yield ───────────────────────
        List<Map<String, Object>> predRows = db.queryForList(
            "SELECT division, predicted_yield FROM monthly_predicted_yield WHERE year=? AND month=?",
            year, month
        );
        Map<String, Double> predMap = new HashMap<>();
        for (Map<String, Object> r : predRows) {
            predMap.put(
                ((String) r.get("division")).trim().toUpperCase(),
                toDouble(r.get("predicted_yield"))
            );
        }

        // ── 3. Division crop details (cash_kilo) ──────────────────────────────
        String cropSql =
            "SELECT d.division_name, dc.cash_kilo, dc.without_cash_avg " +
            "FROM division_crop_details dc " +
            "JOIN division d ON d.division_id = dc.division_id " +
            "WHERE dc.year = ? AND LOWER(TRIM(dc.month)) IN " + inClause;
        List<Map<String, Object>> cropRows = db.queryForList(cropSql, cropParams);
        Map<String, Map<String,Object>> cropMap = new HashMap<>();
        for (Map<String, Object> r : cropRows) {
            cropMap.put(((String)r.get("division_name")).trim().toUpperCase(), r);
        }

        // Build per-division list
        double totalActual = 0, totalPred = 0;
        List<Map<String, Object>> divisionYield = new ArrayList<>();
        for (Map<String, Object> row : ncRows) {
            String divName = ((String) row.get("division_name")).trim();
            String divUpper = divName.toUpperCase();
            double actual    = toDouble(row.get("green_leaf"));
            double predicted = predMap.getOrDefault(divUpper, 0.0);
            Map<String, Object> cropData = cropMap.getOrDefault(divUpper, Map.of());

            Map<String, Object> div = new LinkedHashMap<>();
            div.put("divisionName", divName);
            div.put("actual",       round2(actual));
            div.put("predicted",    round2(predicted));
            div.put("variance",     round2(actual - predicted));
            div.put("variancePct",  predicted > 0 ? round2((actual-predicted)/predicted*100) : 0);
            div.put("pluckers",     toDouble(row.get("pluckers")));
            div.put("ndvi",         round2(toDouble(row.get("ndvi_avg"))));
            div.put("temperature",  round2(toDouble(row.get("avg_temperature"))));
            div.put("rainfall",     round2(toDouble(row.get("avg_rainfall"))));
            div.put("humidity",     round2(toDouble(row.get("avg_humidity"))));
            div.put("cashKilo",     round2(toDouble(cropData.get("cash_kilo"))));
            div.put("withoutCashAvg", round2(toDouble(cropData.get("without_cash_avg"))));
            divisionYield.add(div);
            totalActual += actual;
            totalPred   += predicted;
        }

        report.setDivisionYield(divisionYield);
        report.setTotalActualYield(round2(totalActual));
        report.setTotalPredictedYield(round2(totalPred));
        report.setYieldVariance(round2(totalActual - totalPred));
        report.setYieldVariancePct(totalPred > 0 ? round2((totalActual - totalPred) / totalPred * 100) : 0.0);

        // Climate averages from division_ndvi_climate
        if (!ncRows.isEmpty()) {
            report.setAvgTemperature(round2(ncRows.stream().mapToDouble(r -> toDouble(r.get("avg_temperature"))).average().orElse(0)));
            report.setAvgRainfall(round2(   ncRows.stream().mapToDouble(r -> toDouble(r.get("avg_rainfall"))).average().orElse(0)));
            report.setAvgHumidity(round2(   ncRows.stream().mapToDouble(r -> toDouble(r.get("avg_humidity"))).average().orElse(0)));
            report.setAvgNdvi(round2(       ncRows.stream().mapToDouble(r -> toDouble(r.get("ndvi_avg"))).average().orElse(0)));
        }

        // ── 4. Daily weather ──────────────────────────────────────────────────
        String startDate = String.format("%d-%02d-01", year, month);
        String endDate   = String.format("%d-%02d-01", month==12?year+1:year, month==12?1:month+1);
        List<Map<String, Object>> dailyWeather = db.queryForList("""
            SELECT record_date, division, temperature, rainfall, humidity, ndvi_value
            FROM daily_weather_ndvi
            WHERE record_date >= ?::date AND record_date < ?::date
            ORDER BY record_date ASC
            """, startDate, endDate
        );
        report.setDailyWeather(dailyWeather);

        // ── 5. Financial data ─────────────────────────────────────────────────
        try {
            List<Map<String, Object>> finRows = db.queryForList("""
                SELECT transaction_type, category,
                       SUM(total_amount) AS total_amount
                FROM financial_data_rangala
                WHERE EXTRACT(YEAR FROM transaction_date) = ?
                  AND EXTRACT(MONTH FROM transaction_date) = ?
                GROUP BY transaction_type, category
                ORDER BY transaction_type, category
                """, year, month
            );
            report.setFinancialTransactions(finRows);

            double revenue  = finRows.stream()
                .filter(r -> "Income".equalsIgnoreCase((String) r.get("transaction_type")))
                .mapToDouble(r -> toDouble(r.get("total_amount"))).sum();
            double expenses = finRows.stream()
                .filter(r -> "Expense".equalsIgnoreCase((String) r.get("transaction_type")))
                .mapToDouble(r -> toDouble(r.get("total_amount"))).sum();
            report.setTotalRevenue(round2(revenue));
            report.setTotalExpenses(round2(expenses));
            report.setNetProfitLoss(round2(revenue - expenses));
        } catch (Exception e) {
            report.setFinancialTransactions(List.of());
        }

        // Financial performance (annual — use year)
        try {
            Map<String, Object> fp = db.queryForMap(
                "SELECT plucking_cost, nsa, cop, profit_loss FROM financial_performance WHERE year=? LIMIT 1", year);
            report.setPluckingCost(round2(toDouble(fp.get("plucking_cost"))));
            report.setNsa(round2(toDouble(fp.get("nsa"))));
            report.setCop(round2(toDouble(fp.get("cop"))));
        } catch (Exception ignored) {}

        // ── 6. Fertilizer ─────────────────────────────────────────────────────
        try {
            String fertSql =
                "SELECT fa.fertilizer_type, fa.quantity_kg, fa.yph_month, fa.yph_todate, " +
                "       d.division_name " +
                "FROM fertilizer_application fa " +
                "JOIN division d ON d.division_id = fa.division_id " +
                "WHERE fa.year = ? AND LOWER(TRIM(fa.month)) IN " + inClause +
                " ORDER BY d.division_name";
            List<Map<String, Object>> fertRows = db.queryForList(fertSql, fertParams);
            report.setFertilizerApplications(fertRows);
            double totalFert = fertRows.stream().mapToDouble(r -> toDouble(r.get("quantity_kg"))).sum();
            report.setTotalFertilizerKg(round2(totalFert));
        } catch (Exception e) {
            report.setFertilizerApplications(List.of());
        }

        // ── 7. Agronomic data ─────────────────────────────────────────────────
        try {
            List<Map<String, Object>> agroRows = db.queryForList("""
                SELECT field_no, clone_type, leaf_quality, soil_ph,
                       pest_disease, weed_density, shade_tree, inspected_by
                FROM agronomic_data_rangala
                WHERE EXTRACT(YEAR FROM inspection_date) = ?
                  AND EXTRACT(MONTH FROM inspection_date) = ?
                ORDER BY inspection_date
                """, year, month
            );
            report.setAgronomicData(agroRows);
            if (!agroRows.isEmpty()) {
                report.setAvgLeafQuality(round2(agroRows.stream()
                    .mapToDouble(r -> toDouble(r.get("leaf_quality"))).average().orElse(0)));
                report.setAvgSoilPh(round2(agroRows.stream()
                    .mapToDouble(r -> toDouble(r.get("soil_ph"))).average().orElse(0)));
            }
        } catch (Exception e) {
            report.setAgronomicData(List.of());
        }

        return report;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Returns lowercase month name variants e.g. ["january","jan"] */
    private String[] buildMonthVariants(int month) {
        return Arrays.stream(MONTH_VARIANTS.getOrDefault(month, new String[]{""}))
                     .map(String::toLowerCase)
                     .toArray(String[]::new);
    }

    /** Builds (?,?,?) placeholder string for IN clause */
    private String buildInClause(int count) {
        StringBuilder sb = new StringBuilder("(");
        for (int i = 0; i < count; i++) {
            if (i > 0) sb.append(",");
            sb.append("?");
        }
        sb.append(")");
        return sb.toString();
    }

    /** Prepends year to variants array for use as query params */
    private Object[] buildParams(int year, String[] variants) {
        Object[] params = new Object[1 + variants.length];
        params[0] = year;
        System.arraycopy(variants, 0, params, 1, variants.length);
        return params;
    }

    private double toDouble(Object val) {
        if (val == null) return 0.0;
        if (val instanceof Number) return ((Number) val).doubleValue();
        try { return Double.parseDouble(val.toString()); } catch (Exception e) { return 0.0; }
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}