package com.shelfd.controller;

import com.shelfd.dto.MediaItemRequest;
import com.shelfd.dto.MediaItemResponse;
import com.shelfd.dto.RatingRequest;
import com.shelfd.entity.User;
import com.shelfd.service.MediaItemService;
import jakarta.validation.Valid;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/shelves/{shelfId}/media")
public class MediaItemController {

    private final MediaItemService mediaItemService;

    public MediaItemController(MediaItemService mediaItemService) {
        this.mediaItemService = mediaItemService;
    }

    @PostMapping
    public ResponseEntity<MediaItemResponse> addMediaItem(
            @PathVariable Long shelfId,
            @Valid @RequestBody MediaItemRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(mediaItemService.addMediaItem(shelfId, request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<MediaItemResponse>> getMediaItems(
            @PathVariable Long shelfId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(mediaItemService.getMediaItemsForShelf(shelfId, currentUser));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<MediaItemResponse> updateMediaItem(
            @PathVariable Long shelfId,
            @PathVariable Long itemId,
            @Valid @RequestBody MediaItemRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(mediaItemService.updateMediaItem(itemId, request, currentUser));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteMediaItem(
            @PathVariable Long shelfId,
            @PathVariable Long itemId,
            @AuthenticationPrincipal User currentUser) {
        mediaItemService.deleteMediaItem(itemId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{itemId}/ratings")
    public ResponseEntity<MediaItemResponse> rateMediaItem(
            @PathVariable Long shelfId,
            @PathVariable Long itemId,
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(mediaItemService.rateMediaItem(shelfId, itemId, request.getRating(), currentUser));
    }

    @PostMapping(value = "/{itemId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaItemResponse> uploadCoverImage(
            @PathVariable Long shelfId,
            @PathVariable Long itemId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(mediaItemService.updateCoverImage(itemId, file, currentUser));
    }

    @GetMapping("/{itemId}/cover")
    public ResponseEntity<byte[]> getCoverImage(
            @PathVariable Long shelfId,
            @PathVariable Long itemId,
            @AuthenticationPrincipal User currentUser) {
        MediaItemService.CoverImageData data = mediaItemService.getCoverImage(shelfId, itemId, currentUser);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(data.getContentType()));
        if (data.getFileName() != null && !data.getFileName().isBlank()) {
            headers.setContentDisposition(ContentDisposition.inline().filename(data.getFileName()).build());
        }

        return ResponseEntity.ok().headers(headers).body(data.getData());
    }
}
