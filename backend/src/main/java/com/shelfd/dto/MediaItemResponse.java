package com.shelfd.dto;

import com.shelfd.entity.MediaStatus;
import com.shelfd.entity.MediaType;

import java.time.LocalDateTime;

public class MediaItemResponse {

    private Long id;
    private String title;
    private String creator;
    private String mediaLink;
    private MediaType type;
    private MediaStatus status;
    private Integer rating;
    private Long shelfId;
    private LocalDateTime createdAt;

    public MediaItemResponse(Long id, String title, String creator, String mediaLink,
                             MediaType type, MediaStatus status, Integer rating,
                             Long shelfId, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.mediaLink = mediaLink;
        this.type = type;
        this.status = status;
        this.rating = rating;
        this.shelfId = shelfId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCreator() { return creator; }
    public String getMediaLink() { return mediaLink; }
    public MediaType getType() { return type; }
    public MediaStatus getStatus() { return status; }
    public Integer getRating() { return rating; }
    public Long getShelfId() { return shelfId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
