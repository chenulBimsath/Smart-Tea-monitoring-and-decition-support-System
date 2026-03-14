package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "financial_data_rangala")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @Column(name = "transaction_type", length = 50)
    private String transactionType;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "description_details", length = 255)
    private String descriptionDetails;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "unit_price_rate")
    private BigDecimal unitPriceRate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "voucher_invoice_ref", length = 100)
    private String voucherInvoiceRef;

    @Column(name = "authorized_by", length = 150)
    private String authorizedBy;
}