package com.shelfd.controller;

import com.shelfd.dto.ShelfRequest;
import com.shelfd.dto.ShelfResponse;
import com.shelfd.entity.User;
import com.shelfd.service.ShelfService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelves")
public class ShelfController {

    private final ShelfService shelfService;

    public ShelfController(ShelfService shelfService) {
        this.shelfService = shelfService;
    }

    @PostMapping
    public ResponseEntity<ShelfResponse> createShelf(
            @Valid @RequestBody ShelfRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(shelfService.createShelf(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<ShelfResponse>> getMyShelf(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(shelfService.getShelvesForUser(currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShelfResponse> updateShelf(
            @PathVariable Long id,
            @Valid @RequestBody ShelfRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(shelfService.updateShelf(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelf(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        shelfService.deleteShelf(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
