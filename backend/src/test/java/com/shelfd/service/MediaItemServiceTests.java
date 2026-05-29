package com.shelfd.service;

import com.shelfd.dto.MediaItemResponse;
import com.shelfd.entity.MediaItem;
import com.shelfd.entity.MediaItemRating;
import com.shelfd.entity.MediaStatus;
import com.shelfd.entity.MediaType;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.User;
import com.shelfd.repository.MediaItemRatingRepository;
import com.shelfd.repository.MediaItemRepository;
import com.shelfd.repository.ShelfRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MediaItemServiceTests {

    @Mock
    private MediaItemRepository mediaItemRepository;

    @Mock
    private MediaItemRatingRepository mediaItemRatingRepository;

    @Mock
    private ShelfRepository shelfRepository;

    @InjectMocks
    private MediaItemService mediaItemService;

    @Test
    void rateMediaItem_createsNewRatingAndUpdatesAverage() {
        User owner = new User();
        ReflectionTestUtils.setField(owner, "id", 7L);

        User rater = new User();
        ReflectionTestUtils.setField(rater, "id", 12L);

        Shelf shelf = new Shelf();
        ReflectionTestUtils.setField(shelf, "id", 5L);
        shelf.setOwner(owner);
        shelf.setPublic(true);

        MediaItem item = new MediaItem();
        ReflectionTestUtils.setField(item, "id", 9L);
        item.setShelf(shelf);
        item.setTitle("Dune");
        item.setType(MediaType.BOOK);
        item.setStatus(MediaStatus.FINISHED);

        when(mediaItemRepository.findById(9L)).thenReturn(Optional.of(item));
        when(mediaItemRatingRepository.findByMediaItemIdAndUserId(9L, 12L)).thenReturn(Optional.empty());
        when(mediaItemRepository.save(item)).thenReturn(item);

        MediaItemResponse response = mediaItemService.rateMediaItem(5L, 9L, 8, rater);

        assertThat(response.getRatingCount()).isEqualTo(1);
        assertThat(response.getRatingAverage()).isEqualTo(8.0);
        verify(mediaItemRatingRepository).save(org.mockito.ArgumentMatchers.any(MediaItemRating.class));
    }

    @Test
    void rateMediaItem_updatesExistingRating() {
        User owner = new User();
        ReflectionTestUtils.setField(owner, "id", 7L);

        User rater = new User();
        ReflectionTestUtils.setField(rater, "id", 12L);

        Shelf shelf = new Shelf();
        ReflectionTestUtils.setField(shelf, "id", 5L);
        shelf.setOwner(owner);
        shelf.setPublic(true);

        MediaItem item = new MediaItem();
        ReflectionTestUtils.setField(item, "id", 9L);
        item.setShelf(shelf);
        item.setRatingAverage(7.0);
        item.setRatingCount(2);

        MediaItemRating existing = new MediaItemRating();
        existing.setMediaItem(item);
        existing.setUser(rater);
        existing.setRating(6);

        when(mediaItemRepository.findById(9L)).thenReturn(Optional.of(item));
        when(mediaItemRatingRepository.findByMediaItemIdAndUserId(9L, 12L)).thenReturn(Optional.of(existing));
        when(mediaItemRepository.save(item)).thenReturn(item);

        MediaItemResponse response = mediaItemService.rateMediaItem(5L, 9L, 9, rater);

        assertThat(response.getRatingCount()).isEqualTo(2);
        assertThat(response.getRatingAverage()).isEqualTo(8.5);
        verify(mediaItemRatingRepository).save(existing);
    }
}
