package com.shelfd.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shelf_ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"shelf_id", "user_id"}))
public class ShelfRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelf_id", nullable = false)
    private Shelf shelf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer rating;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ShelfRating() {}

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
    public Shelf getShelf() { return shelf; }
    public User getUser() { return user; }
    public Integer getRating() { return rating; }

    public void setShelf(Shelf shelf) { this.shelf = shelf; }
    public void setUser(User user) { this.user = user; }
    public void setRating(Integer rating) { this.rating = rating; }
}
