package com.shelfd.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "media_items")
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String creator;

    @Column(name = "media_link")
    private String mediaLink;

    @Column(name = "cover_url")
    private String coverUrl;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "cover_image")
    private byte[] coverImage;

    @Column(name = "cover_image_content_type")
    private String coverImageContentType;

    @Column(name = "cover_image_file_name")
    private String coverImageFileName;

    @Column(name = "comment_text", length = 1000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "series_status", nullable = true)
    private SeriesStatus seriesStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_status", nullable = true)
    private UserStatus userStatus;

    // ✅ Added missing field for MediaStatus
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = true)
    private MediaStatus status;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "media_item_genres", joinColumns = @JoinColumn(name = "media_item_id"))
    @Column(name = "genre", length = 40)
    private List<String> genres = new ArrayList<>();

    @Column(nullable = true)
    private Integer rating;

    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "rating_count")
    private Integer ratingCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelf_id", nullable = false)
    private Shelf shelf;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public MediaItem() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCreator() { return creator; }
    public String getMediaLink() { return mediaLink; }
    public String getCoverUrl() { return coverUrl; }
    public byte[] getCoverImage() { return coverImage; }
    public String getCoverImageContentType() { return coverImageContentType; }
    public String getCoverImageFileName() { return coverImageFileName; }
    public String getComment() { return comment; }
    public MediaType getType() { return type; }
    public SeriesStatus getSeriesStatus() { return seriesStatus; }
    public UserStatus getUserStatus() { return userStatus; }
    public MediaStatus getStatus() { return status; } //
    public List<String> getGenres() { return genres; }
    public Integer getRating() { return rating; }
    public Double getRatingAverage() { return ratingAverage; }
    public Integer getRatingCount() { return ratingCount; }
    public Shelf getShelf() { return shelf; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setTitle(String title) { this.title = title; }
    public void setCreator(String creator) { this.creator = creator; }
    public void setMediaLink(String mediaLink) { this.mediaLink = mediaLink; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public void setCoverImage(byte[] coverImage) { this.coverImage = coverImage; }
    public void setCoverImageContentType(String coverImageContentType) { this.coverImageContentType = coverImageContentType; }
    public void setCoverImageFileName(String coverImageFileName) { this.coverImageFileName = coverImageFileName; }
    public void setComment(String comment) { this.comment = comment; }
    public void setType(MediaType type) { this.type = type; }
    public void setSeriesStatus(SeriesStatus seriesStatus) { this.seriesStatus = seriesStatus; }
    public void setUserStatus(UserStatus userStatus) { this.userStatus = userStatus; }
    public void setStatus(MediaStatus status) { this.status = status; } //
    public void setGenres(List<String> genres) { this.genres = genres; }
    public void setRating(Integer rating) { this.rating = rating; }
    public void setRatingAverage(Double ratingAverage) { this.ratingAverage = ratingAverage; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public void setShelf(Shelf shelf) { this.shelf = shelf; }
}
