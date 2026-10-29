package com.expensetracker.dto;

public class CategorySpendingDto {
    private String categoryName;
    private String color;
    private String icon;
    private Double totalAmount;
    private Long transactionCount;
    private Double percentage;

    public CategorySpendingDto() {
    }

    public CategorySpendingDto(String categoryName, String color, String icon, Double totalAmount, Long transactionCount, Double percentage) {
        this.categoryName = categoryName;
        this.color = color;
        this.icon = icon;
        this.totalAmount = totalAmount;
        this.transactionCount = transactionCount;
        this.percentage = percentage;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
