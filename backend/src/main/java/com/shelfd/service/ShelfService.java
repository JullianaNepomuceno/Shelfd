package com.shelfd.service;

import com.shelfd.dto.ShelfRequest;
import com.shelfd.dto.ShelfResponse;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.ShelfRating;
import com.shelfd.entity.User;
import com.shelfd.repository.ShelfRepository;
import com.shelfd.repository.ShelfRatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelfService {

    private final ShelfRepository shelfRepository;
    private final ShelfRatingRepository shelfRatingRepository;

    public ShelfService(ShelfRepository shelfRepository,
                        ShelfRatingRepository shelfRatingRepository) {
        this.shelfRepository = shelfRepository;
        this.shelfRatingRepository = shelfRatingRepository;
    }

    public ShelfResponse createShelf(ShelfRequest request, User owner) {
        Shelf shelf = new Shelf();
        shelf.setName(request.getName());
        shelf.setDescription(request.getDescription());
        shelf.setPublic(request.isPublic());
        shelf.setOwner(owner);

        Shelf saved = shelfRepository.save(shelf);
        return toResponse(saved);
    }

    public List<ShelfResponse> getShelvesForUser(User owner) {
        return shelfRepository.findByOwnerId(owner.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ShelfResponse> getPublicShelves() {
        return shelfRepository.findByIsPublicTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ShelfResponse getShelfById(Long shelfId, User currentUser) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));

        boolean isOwner = shelf.getOwner().getId().equals(currentUser.getId());
        if (!isOwner && !shelf.isPublic()) {
            throw new RuntimeException("Access denied");
        }

        return toResponse(shelf);
    }

    public ShelfResponse updateShelf(Long shelfId, ShelfRequest request, User owner) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));

        if (!shelf.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You do not own this shelf");
        }

        shelf.setName(request.getName());
        shelf.setDescription(request.getDescription());
        shelf.setPublic(request.isPublic());

        return toResponse(shelfRepository.save(shelf));
    }

    public void deleteShelf(Long shelfId, User owner) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));

        if (!shelf.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You do not own this shelf");
        }

        shelfRepository.delete(shelf);
    }

    @Transactional
    public ShelfResponse rateShelf(Long shelfId, int rating, User currentUser) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));

        boolean isOwner = shelf.getOwner().getId().equals(currentUser.getId());
        if (!isOwner && !shelf.isPublic()) {
            throw new RuntimeException("Access denied");
        }

        double avg = shelf.getRatingAverage() == null ? 0.0 : shelf.getRatingAverage();
        int count = shelf.getRatingCount() == null ? 0 : shelf.getRatingCount();
        double sum = avg * count;

        ShelfRating existingRating = shelfRatingRepository
                .findByShelfIdAndUserId(shelfId, currentUser.getId())
                .orElse(null);

        if (existingRating == null) {
            ShelfRating newRating = new ShelfRating();
            newRating.setShelf(shelf);
            newRating.setUser(currentUser);
            newRating.setRating(rating);
            shelfRatingRepository.save(newRating);

            sum += rating;
            count += 1;
        } else {
            sum = sum - existingRating.getRating() + rating;
            existingRating.setRating(rating);
            shelfRatingRepository.save(existingRating);
        }

        double newAverage = count == 0 ? 0.0 : sum / count;
        shelf.setRatingAverage(newAverage);
        shelf.setRatingCount(count);

        return toResponse(shelfRepository.save(shelf));
    }

    private ShelfResponse toResponse(Shelf shelf) {
        return new ShelfResponse(
                shelf.getId(),
                shelf.getName(),
                shelf.getDescription(),
                shelf.isPublic(),
                shelf.getOwner().getDisplayUsername(),
                shelf.getRatingAverage(),
                shelf.getRatingCount(),
                shelf.getCreatedAt()
        );
    }
}