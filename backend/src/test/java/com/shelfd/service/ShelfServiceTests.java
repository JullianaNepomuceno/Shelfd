package com.shelfd.service;

import com.shelfd.entity.Shelf;
import com.shelfd.entity.User;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShelfServiceTests {

    @Mock
    private ShelfRepository shelfRepository;

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
}
