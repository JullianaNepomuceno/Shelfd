package com.shelfd.service;

import com.shelfd.dto.ShelfResponse;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.ShelfRating;
import com.shelfd.entity.User;
import com.shelfd.repository.ShelfRatingRepository;
import com.shelfd.repository.ShelfRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShelfServiceTests {

    @Mock
    private ShelfRepository shelfRepository;

    @Mock
    private ShelfRatingRepository shelfRatingRepository;

    @InjectMocks
    private ShelfService shelfService;

    @Test
    void getShelfById_allowsPublicShelf() {
        User owner = new User();
        ReflectionTestUtils.setField(owner, "id", 7L);
        ReflectionTestUtils.setField(owner, "username", "owner");

        User viewer = new User();
        ReflectionTestUtils.setField(viewer, "id", 12L);

        Shelf shelf = new Shelf();
        ReflectionTestUtils.setField(shelf, "id", 5L);
        shelf.setOwner(owner);
        shelf.setPublic(true);
        shelf.setName("Public Shelf");

        when(shelfRepository.findById(5L)).thenReturn(Optional.of(shelf));

        assertThat(shelfService.getShelfById(5L, viewer).getName()).isEqualTo("Public Shelf");
    }

    @Test
    void getShelfById_rejectsPrivateShelfForNonOwner() {
        User owner = new User();
        ReflectionTestUtils.setField(owner, "id", 7L);

        User viewer = new User();
        ReflectionTestUtils.setField(viewer, "id", 12L);

        Shelf shelf = new Shelf();
        ReflectionTestUtils.setField(shelf, "id", 5L);
        shelf.setOwner(owner);
        shelf.setPublic(false);

        when(shelfRepository.findById(5L)).thenReturn(Optional.of(shelf));

        assertThatThrownBy(() -> shelfService.getShelfById(5L, viewer))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Access denied");
    }

    @Test
    void rateShelf_createsNewRatingAndUpdatesAverage() {
        User owner = new User();
        ReflectionTestUtils.setField(owner, "id", 7L);

        User rater = new User();
        ReflectionTestUtils.setField(rater, "id", 12L);

        Shelf shelf = new Shelf();
        ReflectionTestUtils.setField(shelf, "id", 5L);
        shelf.setOwner(owner);
        shelf.setPublic(true);

        when(shelfRepository.findById(5L)).thenReturn(Optional.of(shelf));
        when(shelfRatingRepository.findByShelfIdAndUserId(5L, 12L)).thenReturn(Optional.empty());
        when(shelfRepository.save(shelf)).thenReturn(shelf);

        ShelfResponse response = shelfService.rateShelf(5L, 8, rater);

        assertThat(response.getRatingCount()).isEqualTo(1);
        assertThat(response.getRatingAverage()).isEqualTo(8.0);
        verify(shelfRatingRepository).save(org.mockito.ArgumentMatchers.any(ShelfRating.class));
    }

    @Test
    void rateShelf_updatesExistingRating() {
        User owner = new User();
        ReflectionTestUtils.setField(owner, "id", 7L);

        User rater = new User();
        ReflectionTestUtils.setField(rater, "id", 12L);

        Shelf shelf = new Shelf();
        ReflectionTestUtils.setField(shelf, "id", 5L);
        shelf.setOwner(owner);
        shelf.setPublic(true);
        shelf.setRatingAverage(7.0);
        shelf.setRatingCount(2);

        ShelfRating existing = new ShelfRating();
        existing.setShelf(shelf);
        existing.setUser(rater);
        existing.setRating(6);

        when(shelfRepository.findById(5L)).thenReturn(Optional.of(shelf));
        when(shelfRatingRepository.findByShelfIdAndUserId(5L, 12L)).thenReturn(Optional.of(existing));
        when(shelfRepository.save(shelf)).thenReturn(shelf);

        ShelfResponse response = shelfService.rateShelf(5L, 9, rater);

        assertThat(response.getRatingCount()).isEqualTo(2);
        assertThat(response.getRatingAverage()).isEqualTo(8.5);
        verify(shelfRatingRepository).save(existing);
    }
}
