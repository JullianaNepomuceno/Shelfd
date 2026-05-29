package com.shelfd.dto;

import java.util.Map;

public class ProfileAnalyticsResponse {
    private long totalMedia;
    private long finishedCount;
    private long unfinishedCount;
    private double averageRating;
    private Map<String, Long> mediaTypeBreakdown;

    public ProfileAnalyticsResponse() {}

    public ProfileAnalyticsResponse(long totalMedia, long finishedCount, long unfinishedCount, double averageRating, Map<String, Long> mediaTypeBreakdown) {
        this.totalMedia = totalMedia;
        this.finishedCount = finishedCount;
        this.unfinishedCount = unfinishedCount;
        this.averageRating = averageRating;
        this.mediaTypeBreakdown = mediaTypeBreakdown;
    }

    public long getTotalMedia() { return totalMedia; }
    public long getFinishedCount() { return finishedCount; }
    public long getUnfinishedCount() { return unfinishedCount; }
    public double getAverageRating() { return averageRating; }
    public Map<String, Long> getMediaTypeBreakdown() { return mediaTypeBreakdown; }
}
