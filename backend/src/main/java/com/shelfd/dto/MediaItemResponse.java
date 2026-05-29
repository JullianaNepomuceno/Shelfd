package com.shelfd.dto;

import com.shelfd.entity.MediaType;
import com.shelfd.entity.SeriesStatus;
import com.shelfd.entity.UserStatus;

import java.time.LocalDateTime;
import java.util.List;

public class MediaItemResponse {

    private Long id;
    private String title;
    private String creator;
    private String mediaLink;
    private String coverUrl;
    private String coverImageUrl;
    private boolean hasCoverImage;
    private String comment;
    private MediaType type;
    private SeriesStatus seriesStatus;
    private UserStatus userStatus;
    private List<String> genres;
    private Integer rating;
    private Double ratingAverage;
    private Integer ratingCount;
    private Long shelfId;
    private LocalDateTime createdAt;

    public MediaItemResponse(Long id, String title, String creator, String mediaLink,
                             String coverUrl, String coverImageUrl, boolean hasCoverImage,
                             String comment, MediaType type, SeriesStatus seriesStatus,
                             UserStatus userStatus, List<String> genres, Integer rating,
                             Double ratingAverage, Integer ratingCount, Long shelfId,
                             LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.mediaLink = mediaLink;
        this.coverUrl = coverUrl;
        this.coverImageUrl = coverImageUrl;
        this.hasCoverImage = hasCoverImage;
        this.comment = comment;
        this.type = type;
        this.seriesStatus = seriesStatus;
        this.userStatus = userStatus;
        this.genres = genres;
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
    public String getCoverImageUrl() { return coverImageUrl; }
    public boolean isHasCoverImage() { return hasCoverImage; }
    public String getComment() { return comment; }
    public MediaType getType() { return type; }
    public SeriesStatus getSeriesStatus() { return seriesStatus; }
    public UserStatus getUserStatus() { return userStatus; }
    public List<String> getGenres() { return genres; }
    public Integer getRating() { return rating; }
    public Double getRatingAverage() { return ratingAverage; }
    public Integer getRatingCount() { return ratingCount; }
    public Long getShelfId() { return shelfId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
