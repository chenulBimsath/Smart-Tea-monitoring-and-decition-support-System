package com.tea_management.tea_backend.dto;

public class UpdateProfileDTO {
    private String fullName;
    private String mobileNum;
    private String address;

    public String getFullName()               { return fullName; }
    public void setFullName(String fullName)  { this.fullName = fullName; }

    public String getMobileNum()              { return mobileNum; }
    public void setMobileNum(String m)        { this.mobileNum = m; }

    public String getAddress()                { return address; }
    public void setAddress(String address)    { this.address = address; }
}
