package com.shelfd.repository;

import com.shelfd.entity.MediaItem;
import com.shelfd.entity.MediaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {

    List<MediaItem> findByShelfId(Long shelfId);

    void deleteAllByShelfId(Long shelfId);

    long countByShelfOwnerId(Long ownerId);

    long countByShelfOwnerIdAndStatus(Long ownerId, MediaStatus status);

    @Query("SELECT COALESCE(AVG(m.ratingAverage), 0) FROM MediaItem m WHERE m.shelf.owner.id = :ownerId")
    Double findAverageRatingByOwnerId(Long ownerId);

    @Query("SELECT m.type as type, COUNT(m) as cnt FROM MediaItem m WHERE m.shelf.owner.id = :ownerId GROUP BY m.type")
    List<Object[]> countByTypeForOwner(Long ownerId);

    @Query("SELECT g, COUNT(m) FROM MediaItem m JOIN m.genres g WHERE m.shelf.owner.id = :ownerId GROUP BY g ORDER BY COUNT(m) DESC")
    List<Object[]> countTopGenresForOwner(@Param("ownerId") Long ownerId);

    @Query("SELECT g, COUNT(m) FROM MediaItem m JOIN m.genres g GROUP BY g ORDER BY COUNT(m) DESC")
    List<Object[]> countTopGenresGlobal();

    @Query("SELECT m.type, COUNT(m) FROM MediaItem m GROUP BY m.type ORDER BY COUNT(m) DESC")
    List<Object[]> countTopMediaTypesGlobal();
}
