package com.twoway.Xinwu.model;

public class recordSearch {
    private String plateNumber = "";
    private String startDate = "";
    private String endDate = "";
    private Boolean plateIn = true;

    public String getPlateNumber() {
        return this.plateNumber;
    }

    public void setPlateNumber(String platenumber) {
        this.plateNumber = platenumber;
    }

    public String getStartDate() {
        return this.startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return this.endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Boolean getPlateIn() {
        return this.plateIn;
    }

    public void setPlateIn(Boolean plateIn) {
        this.plateIn = plateIn;
    }

    // @Override
    // public String toString() {
    //     return "{" +
    //             ", plateNumber='" + getPlateNumber() + "'" +
    //             ", startDate='" + getStartDate() + "'" +
    //             ", endDate='" + getEndDate() + "'" +
    //             ", plateIn='" + getPlateIn() + "'" +
    //             "}";
    // }

    @Override
    public String toString() {
        return "{" +
                "plateNumber='" + getPlateNumber() + '\'' +
                ", startDate='" + getStartDate() + '\'' +
                ", endDate='" + getEndDate() + '\'' +
                ", plateIn=" + getPlateIn() +
                "}";
    }

}
