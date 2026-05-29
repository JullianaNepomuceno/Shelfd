package com.shelfd.service;

import com.shelfd.dto.ProfileAnalyticsResponse;
import com.shelfd.dto.ProfileResponse;
import com.shelfd.dto.UpdateProfileRequest;
import com.shelfd.entity.MediaStatus;
import com.shelfd.entity.MediaType;
import com.shelfd.entity.User;
import com.shelfd.repository.MediaItemRepository;
import com.shelfd.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final MediaItemRepository mediaItemRepository;

    private final Path avatarsDir = Path.of("uploads", "avatars");

    public ProfileService(UserRepository userRepository, MediaItemRepository mediaItemRepository) {
        this.userRepository = userRepository;
        this.mediaItemRepository = mediaItemRepository;
    }

    public ProfileResponse getProfile(User currentUser) {
        return toResponse(currentUser);
    }

    public ProfileResponse updateProfile(UpdateProfileRequest req, User currentUser) {
        String newUsername = req.getUsername().trim();
        if (!newUsername.equals(currentUser.getDisplayUsername())) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
            }
            currentUser.setUsername(newUsername);
        }
        if (req.getFirstName() != null) currentUser.setFirstName(req.getFirstName());
        if (req.getLastName() != null) currentUser.setLastName(req.getLastName());

        User saved = userRepository.save(currentUser);
        return toResponse(saved);
    }

    public ProfileResponse uploadAvatar(MultipartFile file, User currentUser) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty file");
        }

        // Validate size (<= 2MB) and content type
        long maxBytes = 2L * 1024 * 1024;
        if (file.getSize() > maxBytes) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File too large");
        }
        String ct = file.getContentType();
        if (ct == null || (!ct.equals("image/jpeg") && !ct.equals("image/png") && !ct.equals("image/webp"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported file type");
        }

        try {
            Files.createDirectories(avatarsDir);

            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = "avatar-user-" + currentUser.getId() + "-" + System.currentTimeMillis() + ext;
            Path dest = avatarsDir.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            String publicUrl = "/avatars/" + filename;
            currentUser.setAvatarUrl(publicUrl);
            userRepository.save(currentUser);
            return toResponse(currentUser);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file", e);
        }
    }

    public ProfileAnalyticsResponse getAnalytics(User currentUser) {
        Long userId = currentUser.getId();
        long total = mediaItemRepository.countByShelfOwnerId(userId);
        long finished = mediaItemRepository.countByShelfOwnerIdAndStatus(userId, MediaStatus.FINISHED);
        long unfinished = total - finished;
        Double avg = mediaItemRepository.findAverageRatingByOwnerId(userId);
        double averageRating = avg == null ? 0.0 : avg;

        List<Object[]> byType = mediaItemRepository.countByTypeForOwner(userId);
        Map<String, Long> breakdown = new HashMap<>();
        for (Object[] row : byType) {
            if (row.length >= 2 && row[0] != null && row[1] != null) {
                MediaType type = (MediaType) row[0];
                Number cnt = (Number) row[1];
                breakdown.put(type.name(), cnt.longValue());
            }
        }

        return new ProfileAnalyticsResponse(total, finished, unfinished, averageRating, breakdown);
    }

    private ProfileResponse toResponse(User u) {
        return new ProfileResponse(u.getId(), u.getDisplayUsername(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getAvatarUrl(), u.getCreatedAt());
    }
}
