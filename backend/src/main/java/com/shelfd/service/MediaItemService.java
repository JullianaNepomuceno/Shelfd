package com.shelfd.service;

import com.shelfd.dto.MediaItemRequest;
import com.shelfd.dto.MediaItemResponse;
import com.shelfd.entity.MediaItem;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.User;
import com.shelfd.entity.MediaItemRating;
import com.shelfd.entity.UserStatus;
import com.shelfd.repository.MediaItemRatingRepository;
import com.shelfd.repository.MediaItemRepository;
import com.shelfd.repository.ShelfRepository;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
        item.setType(request.getType());
        item.setSeriesStatus(request.getSeriesStatus());
        item.setUserStatus(request.getUserStatus());
        item.setGenres(normalizeGenres(request.getGenres()));
        // Ensure legacy non-nullable DB column is populated with a sensible default
        item.setStatus(com.shelfd.entity.MediaStatus.UNFINISHED);

        applyUserStatusRules(item, request.getUserStatus(), request.getRating(), request.getComment());
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
        item.setType(request.getType());
        item.setSeriesStatus(request.getSeriesStatus());
        item.setUserStatus(request.getUserStatus());
        item.setGenres(normalizeGenres(request.getGenres()));

        applyUserStatusRules(item, request.getUserStatus(), request.getRating(), request.getComment());

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

    public MediaItemResponse updateCoverImage(Long itemId, MultipartFile file, User currentUser) {
        MediaItem item = mediaItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Media item not found"));

        if (!item.getShelf().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You do not own this media item");
        }

        try {
            item.setCoverImage(file.getBytes());
        } catch (IOException ex) {
            throw new RuntimeException("Failed to read cover image", ex);
        }

        item.setCoverImageContentType(Optional.ofNullable(file.getContentType()).orElse(MediaType.APPLICATION_OCTET_STREAM_VALUE));
        item.setCoverImageFileName(file.getOriginalFilename());

        return toResponse(mediaItemRepository.save(item));
    }

    public CoverImageData getCoverImage(Long shelfId, Long itemId, User currentUser) {
        MediaItem item = mediaItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Media item not found"));

        if (!item.getShelf().getId().equals(shelfId)) {
            throw new RuntimeException("Media item does not belong to this shelf");
        }

        boolean isOwner = item.getShelf().getOwner().getId().equals(currentUser.getId());
        if (!isOwner && !item.getShelf().isPublic()) {
            throw new RuntimeException("Access denied");
        }

        if (item.getCoverImage() == null) {
            throw new RuntimeException("Cover image not found");
        }

        return new CoverImageData(item.getCoverImage(), item.getCoverImageContentType(), item.getCoverImageFileName());
    }

    private void applyUserStatusRules(MediaItem item, UserStatus userStatus, Integer rating, String comment) {
        if (userStatus != UserStatus.FINISHED) {
            item.setRating(null);
            item.setComment(null);
            return;
        }

        item.setRating(rating);
        item.setComment(comment);
    }

    private List<String> normalizeGenres(List<String> genres) {
        if (genres == null) {
            return Collections.emptyList();
        }

        return genres.stream()
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    private MediaItemResponse toResponse(MediaItem item) {
        boolean hasCoverImage = item.getCoverImage() != null && item.getCoverImage().length > 0;
        String coverImageUrl = hasCoverImage
                ? "/api/shelves/" + item.getShelf().getId() + "/media/" + item.getId() + "/cover"
                : null;

        return new MediaItemResponse(
                item.getId(),
                item.getTitle(),
                item.getCreator(),
                item.getMediaLink(),
                item.getCoverUrl(),
                coverImageUrl,
                hasCoverImage,
                item.getComment(),
                item.getType(),
                item.getSeriesStatus(),
                item.getUserStatus(),
                item.getGenres(),
                item.getRating(),
                item.getRatingAverage(),
                item.getRatingCount(),
                item.getShelf().getId(),
                item.getCreatedAt()
        );
    }

    public static class CoverImageData {
        private final byte[] data;
        private final String contentType;
        private final String fileName;

        public CoverImageData(byte[] data, String contentType, String fileName) {
            this.data = data;
            this.contentType = contentType;
            this.fileName = fileName;
        }

        public byte[] getData() { return data; }
        public String getContentType() { return contentType; }
        public String getFileName() { return fileName; }
    }
}
