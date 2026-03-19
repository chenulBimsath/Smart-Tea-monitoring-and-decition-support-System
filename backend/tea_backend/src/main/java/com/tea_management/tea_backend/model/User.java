package com.tea_management.tea_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "\"User\"")
public class User {

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "role")
    private String role;

    @Column(name = "estate_id")
    private Integer estateId;

    @Column(name = "division_id")
    private Integer divisionId;

    @Column(name = "password")
    private String password;

    @Column(name = "mobile_num")
    private String mobileNum;

    @Column(name = "joined_date")
    private LocalDate joinedDate;

    @Column(name = "address")
    private String address;

    @Column(name = "department")
    private String department;

    // Getters & Setters
    public String getUserId()               { return userId; }
    public void setUserId(String userId)    { this.userId = userId; }

    public String getFullName()                { return fullName; }
    public void setFullName(String fullName)   { this.fullName = fullName; }

    public String getEmail()                { return email; }
    public void setEmail(String email)      { this.email = email; }

    public String getRole()                 { return role; }
    public void setRole(String role)        { this.role = role; }

    public Integer getEstateId()               { return estateId; }
    public void setEstateId(Integer estateId)  { this.estateId = estateId; }

    public Integer getDivisionId()                 { return divisionId; }
    public void setDivisionId(Integer divisionId)  { this.divisionId = divisionId; }

    public String getPassword()                { return password; }
    public void setPassword(String password)   { this.password = password; }

    public String getMobileNum()               { return mobileNum; }
    public void setMobileNum(String mobileNum) { this.mobileNum = mobileNum; }

    public LocalDate getJoinedDate()               { return joinedDate; }
    public void setJoinedDate(LocalDate joinedDate) { this.joinedDate = joinedDate; }

    public String getAddress()                { return address; }
    public void setAddress(String address)    { this.address = address; }

    public String getDepartment()                 { return department; }
    public void setDepartment(String department)  { this.department = department; }
}
