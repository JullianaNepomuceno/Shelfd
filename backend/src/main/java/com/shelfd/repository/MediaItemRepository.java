package com.shelfd.repository;

import com.shelfd.entity.MediaItem;
import com.shelfd.entity.MediaStatus;
import com.shelfd.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {

    List<MediaItem> findByShelfId(Long shelfId);

    long countByShelfOwnerId(Long ownerId);

    long countByShelfOwnerIdAndStatus(Long ownerId, MediaStatus status);

    @Query("SELECT COALESCE(AVG(m.ratingAverage), 0) FROM MediaItem m WHERE m.shelf.owner.id = :ownerId")
    Double findAverageRatingByOwnerId(Long ownerId);

    @Query("SELECT m.type as type, COUNT(m) as cnt FROM MediaItem m WHERE m.shelf.owner.id = :ownerId GROUP BY m.type")
    List<Object[]> countByTypeForOwner(Long ownerId);
}
