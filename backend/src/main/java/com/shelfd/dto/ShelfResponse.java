package com.shelfd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class ShelfResponse {

    private Long id;
    private String name;
    private String description;
    @JsonProperty("isPublic")
    private boolean isPublic;
    private String ownerUsername;
    private Double ratingAverage;
    private Integer ratingCount;
    private LocalDateTime createdAt;

    public ShelfResponse(Long id, String name, String description,
                         boolean isPublic, String ownerUsername, Double ratingAverage,
                         Integer ratingCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.ownerUsername = ownerUsername;
        this.ratingAverage = ratingAverage;
        this.ratingCount = ratingCount;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    @JsonProperty("isPublic")
    public boolean isPublic() { return isPublic; }
    public String getOwnerUsername() { return ownerUsername; }
    public Double getRatingAverage() { return ratingAverage; }
    public Integer getRatingCount() { return ratingCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
