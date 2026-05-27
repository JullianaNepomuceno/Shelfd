package com.shelfd.repository;

import com.shelfd.entity.MediaItemRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MediaItemRatingRepository extends JpaRepository<MediaItemRating, Long> {

    Optional<MediaItemRating> findByMediaItemIdAndUserId(Long mediaItemId, Long userId);
}
