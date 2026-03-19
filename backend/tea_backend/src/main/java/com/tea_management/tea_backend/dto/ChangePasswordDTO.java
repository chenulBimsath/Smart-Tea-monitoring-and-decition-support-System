package com.tea_management.tea_backend.dto;

public class ChangePasswordDTO {
    private String currentPassword;
    private String newPassword;

    public String getCurrentPassword()              { return currentPassword; }
    public void setCurrentPassword(String p)        { this.currentPassword = p; }

    public String getNewPassword()                  { return newPassword; }
    public void setNewPassword(String newPassword)  { this.newPassword = newPassword; }
}
