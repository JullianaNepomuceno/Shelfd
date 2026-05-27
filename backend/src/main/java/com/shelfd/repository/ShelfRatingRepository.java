package com.shelfd.repository;

import com.shelfd.entity.ShelfRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShelfRatingRepository extends JpaRepository<ShelfRating, Long> {

    Optional<ShelfRating> findByShelfIdAndUserId(Long shelfId, Long userId);
}
