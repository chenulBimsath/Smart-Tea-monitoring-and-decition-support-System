package com.tea_management.tea_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class FinancialDataDTO {
    private Integer id;
    private LocalDate transactionDate;
    private String transactionType;
    private String category;
    private String descriptionDetails;
    private BigDecimal quantity;
    private BigDecimal unitPriceRate;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String voucherInvoiceRef;
    private String authorizedBy;
}