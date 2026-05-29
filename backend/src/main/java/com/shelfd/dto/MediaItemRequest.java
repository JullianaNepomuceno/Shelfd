package com.shelfd.dto;

import com.shelfd.entity.MediaType;
import com.shelfd.entity.SeriesStatus;
import com.shelfd.entity.UserStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class MediaItemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String creator;

    private String mediaLink;

    private String coverUrl;

    @jakarta.validation.constraints.Size(max = 1000, message = "Comment must be 1000 characters or less")
    private String comment;

    @NotNull(message = "Media type is required")
    private MediaType type;

    @NotNull(message = "Series status is required")
    private SeriesStatus seriesStatus;

    @NotNull(message = "User status is required")
    private UserStatus userStatus;

    @Size(max = 12, message = "Genres must be 12 tags or fewer")
    private List<String> genres;

    @Min(value = 1, message = "Rating must be between 1 and 10")
    @Max(value = 10, message = "Rating must be between 1 and 10")
    private Integer rating;

    public String getTitle() { return title; }
    public String getCreator() { return creator; }
    public String getMediaLink() { return mediaLink; }
    public String getCoverUrl() { return coverUrl; }
    public String getComment() { return comment; }
    public MediaType getType() { return type; }
    public SeriesStatus getSeriesStatus() { return seriesStatus; }
    public UserStatus getUserStatus() { return userStatus; }
    public List<String> getGenres() { return genres; }
    public Integer getRating() { return rating; }
}
