package com.tea_management.tea_backend.dto;

/**
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/dto/RegisterRequest.java
 */
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role;
    private String mobileNum;
    private String department;
    private String address;

    // Getters & Setters
    public String getFullName()               { return fullName; }
    public void   setFullName(String v)       { this.fullName = v; }
    public String getEmail()                  { return email; }
    public void   setEmail(String v)          { this.email = v; }
    public String getPassword()               { return password; }
    public void   setPassword(String v)       { this.password = v; }
    public String getRole()                   { return role; }
    public void   setRole(String v)           { this.role = v; }
    public String getMobileNum()              { return mobileNum; }
    public void   setMobileNum(String v)      { this.mobileNum = v; }
    public String getDepartment()             { return department; }
    public void   setDepartment(String v)     { this.department = v; }
    public String getAddress()                { return address; }
    public void   setAddress(String v)        { this.address = v; }
}
