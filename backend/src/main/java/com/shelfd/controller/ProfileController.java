package com.shelfd.controller;

import com.shelfd.dto.ProfileAnalyticsResponse;
import com.shelfd.dto.ProfileResponse;
import com.shelfd.dto.UpdateProfileRequest;
import com.shelfd.entity.User;
import com.shelfd.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(profileService.getProfile(currentUser));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(profileService.updateProfile(request, currentUser));
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> uploadAvatar(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(profileService.uploadAvatar(file, currentUser));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ProfileAnalyticsResponse> analytics(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(profileService.getAnalytics(currentUser));
    }
}
