package com.tea_management.tea_backend.dto;

import java.time.LocalDate;

public class UserProfileDTO {

    private String userId;
    private String fullName;
    private String email;
    private String role;
    private String mobileNum;
    private LocalDate joinedDate;
    private String address;
    private String department;

    // Estate info
    private Integer estateId;
    private String  estateName;

    // Division info
    private Integer divisionId;
    private String  divisionName;

    // Getters & Setters
    public String getUserId()                     { return userId; }
    public void setUserId(String userId)          { this.userId = userId; }

    public String getFullName()                   { return fullName; }
    public void setFullName(String fullName)      { this.fullName = fullName; }

    public String getEmail()                      { return email; }
    public void setEmail(String email)            { this.email = email; }

    public String getRole()                       { return role; }
    public void setRole(String role)              { this.role = role; }

    public String getMobileNum()                  { return mobileNum; }
    public void setMobileNum(String mobileNum)    { this.mobileNum = mobileNum; }

    public LocalDate getJoinedDate()              { return joinedDate; }
    public void setJoinedDate(LocalDate d)        { this.joinedDate = d; }

    public String getAddress()                    { return address; }
    public void setAddress(String address)        { this.address = address; }

    public String getDepartment()                 { return department; }
    public void setDepartment(String department)  { this.department = department; }

    public Integer getEstateId()                  { return estateId; }
    public void setEstateId(Integer estateId)     { this.estateId = estateId; }

    public String getEstateName()                 { return estateName; }
    public void setEstateName(String estateName)  { this.estateName = estateName; }

    public Integer getDivisionId()                { return divisionId; }
    public void setDivisionId(Integer divisionId) { this.divisionId = divisionId; }

    public String getDivisionName()               { return divisionName; }
    public void setDivisionName(String n)         { this.divisionName = n; }
}
