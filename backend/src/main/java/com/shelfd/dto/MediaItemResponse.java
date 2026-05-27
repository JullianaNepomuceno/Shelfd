package com.shelfd.dto;

import com.shelfd.entity.MediaStatus;
import com.shelfd.entity.MediaType;

import java.time.LocalDateTime;

public class MediaItemResponse {

    private Long id;
    private String title;
    private String creator;
    private String mediaLink;
    private String coverUrl;
    private String comment;
    private MediaType type;
    private MediaStatus status;
    private Integer rating;
    private Double ratingAverage;
    private Integer ratingCount;
    private Long shelfId;
    private LocalDateTime createdAt;

    public MediaItemResponse(Long id, String title, String creator, String mediaLink,
                             String coverUrl, String comment, MediaType type,
                             MediaStatus status, Integer rating, Double ratingAverage,
                             Integer ratingCount, Long shelfId, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.mediaLink = mediaLink;
        this.coverUrl = coverUrl;
        this.comment = comment;
        this.type = type;
        this.status = status;
        this.rating = rating;
        this.ratingAverage = ratingAverage;
        this.ratingCount = ratingCount;
        this.shelfId = shelfId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCreator() { return creator; }
    public String getMediaLink() { return mediaLink; }
    public String getCoverUrl() { return coverUrl; }
    public String getComment() { return comment; }
    public MediaType getType() { return type; }
    public MediaStatus getStatus() { return status; }
    public Integer getRating() { return rating; }
    public Double getRatingAverage() { return ratingAverage; }
    public Integer getRatingCount() { return ratingCount; }
    public Long getShelfId() { return shelfId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
