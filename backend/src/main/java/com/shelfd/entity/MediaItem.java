package com.shelfd.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

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

    @Column(name = "comment_text", length = 1000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaStatus status;

    @Column(nullable = true)
    private Integer rating;

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
    public String getComment() { return comment; }
    public MediaType getType() { return type; }
    public MediaStatus getStatus() { return status; }
    public Integer getRating() { return rating; }
    public Shelf getShelf() { return shelf; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setTitle(String title) { this.title = title; }
    public void setCreator(String creator) { this.creator = creator; }
    public void setMediaLink(String mediaLink) { this.mediaLink = mediaLink; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public void setComment(String comment) { this.comment = comment; }
    public void setType(MediaType type) { this.type = type; }
    public void setStatus(MediaStatus status) { this.status = status; }
    public void setRating(Integer rating) { this.rating = rating; }
    public void setShelf(Shelf shelf) { this.shelf = shelf; }
}
