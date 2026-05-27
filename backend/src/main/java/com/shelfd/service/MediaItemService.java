package com.shelfd.service;

import com.shelfd.dto.MediaItemRequest;
import com.shelfd.dto.MediaItemResponse;
import com.shelfd.entity.MediaItem;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.User;
import com.shelfd.entity.MediaItemRating;
import com.shelfd.repository.MediaItemRatingRepository;
import com.shelfd.repository.MediaItemRepository;
import com.shelfd.repository.ShelfRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MediaItemService {

    private final MediaItemRepository mediaItemRepository;
    private final MediaItemRatingRepository mediaItemRatingRepository;
    private final ShelfRepository shelfRepository;

    public MediaItemService(MediaItemRepository mediaItemRepository,
                            MediaItemRatingRepository mediaItemRatingRepository,
                            ShelfRepository shelfRepository) {
        this.mediaItemRepository = mediaItemRepository;
        this.mediaItemRatingRepository = mediaItemRatingRepository;
        this.shelfRepository = shelfRepository;
    }

    public MediaItemResponse addMediaItem(Long shelfId, MediaItemRequest request, User currentUser) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));

        if (!shelf.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You do not own this shelf");
        }

        MediaItem item = new MediaItem();
        item.setTitle(request.getTitle());
        item.setCreator(request.getCreator());
        item.setMediaLink(request.getMediaLink());
        item.setCoverUrl(request.getCoverUrl());
        item.setComment(request.getComment());
        item.setType(request.getType());
        item.setStatus(request.getStatus());
        item.setRating(request.getRating());
        item.setShelf(shelf);

        return toResponse(mediaItemRepository.save(item));
    }

    public List<MediaItemResponse> getMediaItemsForShelf(Long shelfId, User currentUser) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));

        if (!shelf.getOwner().getId().equals(currentUser.getId()) && !shelf.isPublic()) {
            throw new RuntimeException("Access denied");
        }

        return mediaItemRepository.findByShelfId(shelfId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MediaItemResponse updateMediaItem(Long itemId, MediaItemRequest request, User currentUser) {
        MediaItem item = mediaItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Media item not found"));

        if (!item.getShelf().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You do not own this media item");
        }

        item.setTitle(request.getTitle());
        item.setCreator(request.getCreator());
        item.setMediaLink(request.getMediaLink());
        item.setCoverUrl(request.getCoverUrl());
        item.setComment(request.getComment());
        item.setType(request.getType());
        item.setStatus(request.getStatus());
        item.setRating(request.getRating());

        return toResponse(mediaItemRepository.save(item));
    }

    public void deleteMediaItem(Long itemId, User currentUser) {
        MediaItem item = mediaItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Media item not found"));

        if (!item.getShelf().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You do not own this media item");
        }

        mediaItemRepository.delete(item);
    }

    @Transactional
    public MediaItemResponse rateMediaItem(Long shelfId, Long itemId, int rating, User currentUser) {
        MediaItem item = mediaItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Media item not found"));

        if (!item.getShelf().getId().equals(shelfId)) {
            throw new RuntimeException("Media item does not belong to this shelf");
        }

        boolean isOwner = item.getShelf().getOwner().getId().equals(currentUser.getId());
        if (!isOwner && !item.getShelf().isPublic()) {
            throw new RuntimeException("Access denied");
        }

        double avg = item.getRatingAverage() == null ? 0.0 : item.getRatingAverage();
        int count = item.getRatingCount() == null ? 0 : item.getRatingCount();
        double sum = avg * count;

        MediaItemRating existingRating = mediaItemRatingRepository
                .findByMediaItemIdAndUserId(itemId, currentUser.getId())
                .orElse(null);

        if (existingRating == null) {
            MediaItemRating newRating = new MediaItemRating();
            newRating.setMediaItem(item);
            newRating.setUser(currentUser);
            newRating.setRating(rating);
            mediaItemRatingRepository.save(newRating);

            sum += rating;
            count += 1;
        } else {
            sum = sum - existingRating.getRating() + rating;
            existingRating.setRating(rating);
            mediaItemRatingRepository.save(existingRating);
        }

        double newAverage = count == 0 ? 0.0 : sum / count;
        item.setRatingAverage(newAverage);
        item.setRatingCount(count);

        return toResponse(mediaItemRepository.save(item));
    }

    private MediaItemResponse toResponse(MediaItem item) {
        return new MediaItemResponse(
                item.getId(),
                item.getTitle(),
                item.getCreator(),
                item.getMediaLink(),
                item.getCoverUrl(),
                item.getComment(),
                item.getType(),
                item.getStatus(),
                item.getRating(),
                item.getRatingAverage(),
                item.getRatingCount(),
                item.getShelf().getId(),
                item.getCreatedAt()
        );
    }
}
