package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/model/User.java
 *
 * Maps to: public."User"
 * Table name is quoted because User is a reserved word in PostgreSQL.
 */
@Entity
@Table(name = "\"User\"", schema = "public")
public class User {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "mobile_num")
    private String mobileNum;

    @Column(name = "department")
    private String department;

    @Column(name = "address")
    private String address;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "estate_id")
    private Integer estateId;

    @Column(name = "division_id")
    private Integer divisionId;

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public String    getUserId()                { return userId; }
    public void      setUserId(String v)        { this.userId = v; }

    public String    getFullName()              { return fullName; }
    public void      setFullName(String v)      { this.fullName = v; }

    public String    getEmail()                 { return email; }
    public void      setEmail(String v)         { this.email = v; }

    public String    getPassword()              { return password; }
    public void      setPassword(String v)      { this.password = v; }

    public String    getRole()                  { return role; }
    public void      setRole(String v)          { this.role = v; }

    public String    getMobileNum()             { return mobileNum; }
    public void      setMobileNum(String v)     { this.mobileNum = v; }

    public String    getDepartment()            { return department; }
    public void      setDepartment(String v)    { this.department = v; }

    public String    getAddress()               { return address; }
    public void      setAddress(String v)       { this.address = v; }

    public LocalDate getJoinedDate()            { return joinedDate; }
    public void      setJoinedDate(LocalDate v) { this.joinedDate = v; }

    public Integer   getEstateId()              { return estateId; }
    public void      setEstateId(Integer v)     { this.estateId = v; }

    public Integer   getDivisionId()            { return divisionId; }
    public void      setDivisionId(Integer v)   { this.divisionId = v; }
}
