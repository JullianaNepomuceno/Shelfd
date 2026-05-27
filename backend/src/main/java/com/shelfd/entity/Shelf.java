package com.shelfd.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shelves")
public class Shelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = false;

    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "rating_count")
    private Integer ratingCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Shelf() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public boolean isPublic() { return isPublic; }
    public Double getRatingAverage() { return ratingAverage; }
    public Integer getRatingCount() { return ratingCount; }
    public User getOwner() { return owner; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    public void setRatingAverage(Double ratingAverage) { this.ratingAverage = ratingAverage; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public void setOwner(User owner) { this.owner = owner; }
}
