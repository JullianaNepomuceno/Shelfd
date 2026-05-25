package com.shelfd.service;

import com.shelfd.dto.MediaItemRequest;
import com.shelfd.dto.MediaItemResponse;
import com.shelfd.entity.MediaItem;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.User;
import com.shelfd.repository.MediaItemRepository;
import com.shelfd.repository.ShelfRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MediaItemService {

    private final MediaItemRepository mediaItemRepository;
    private final ShelfRepository shelfRepository;

    public MediaItemService(MediaItemRepository mediaItemRepository,
                            ShelfRepository shelfRepository) {
        this.mediaItemRepository = mediaItemRepository;
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

    private MediaItemResponse toResponse(MediaItem item) {
        return new MediaItemResponse(
                item.getId(),
                item.getTitle(),
                item.getCreator(),
                item.getMediaLink(),
                item.getType(),
                item.getStatus(),
                item.getRating(),
                item.getShelf().getId(),
                item.getCreatedAt()
        );
    }
}
