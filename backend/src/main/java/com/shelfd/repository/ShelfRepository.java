package com.shelfd.repository;

import com.shelfd.entity.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelfRepository extends JpaRepository<Shelf, Long> {

    List<Shelf> findByOwnerId(Long ownerId);

    List<Shelf> findByIsPublicTrue();
}
