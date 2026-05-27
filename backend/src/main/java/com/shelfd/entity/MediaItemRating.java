package com.shelfd.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "media_item_ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"media_item_id", "user_id"}))
public class MediaItemRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_item_id", nullable = false)
    private MediaItem mediaItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer rating;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public MediaItemRating() {}

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public MediaItem getMediaItem() { return mediaItem; }
    public User getUser() { return user; }
    public Integer getRating() { return rating; }

    public void setMediaItem(MediaItem mediaItem) { this.mediaItem = mediaItem; }
    public void setUser(User user) { this.user = user; }
    public void setRating(Integer rating) { this.rating = rating; }
}
