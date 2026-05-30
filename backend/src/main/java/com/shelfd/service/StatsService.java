package com.shelfd.service;

import com.shelfd.dto.MonthlyStatsResponse;
import com.shelfd.entity.MediaType;
import com.shelfd.entity.Shelf;
import com.shelfd.entity.User;
import com.shelfd.repository.MediaItemRepository;
import com.shelfd.repository.ShelfRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final MediaItemRepository mediaItemRepository;
    private final ShelfRepository shelfRepository;

    public StatsService(MediaItemRepository mediaItemRepository,
                        ShelfRepository shelfRepository) {
        this.mediaItemRepository = mediaItemRepository;
        this.shelfRepository = shelfRepository;
    }

    public MonthlyStatsResponse getMonthlyStats() {
        return new MonthlyStatsResponse(
                buildMediaTypeRankings(),
                buildGenreRankings(),
                buildTopShelves(),
                null,
                null
        );
    }

    public MonthlyStatsResponse getMonthlyStatsForUser(User currentUser) {
        Long userId = currentUser.getId();
        return new MonthlyStatsResponse(
                buildMediaTypeRankings(),
                buildGenreRankings(),
                buildTopShelves(),
                buildPersonalMediaTypeRankings(userId),
                buildPersonalGenreRankings(userId)
        );
    }

    private List<MonthlyStatsResponse.RankEntry> buildMediaTypeRankings() {
        return mediaItemRepository.countTopMediaTypesGlobal()
                .stream()
                .limit(5)
                .map(row -> new MonthlyStatsResponse.RankEntry(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    private List<MonthlyStatsResponse.RankEntry> buildGenreRankings() {
        return mediaItemRepository.countTopGenresGlobal()
                .stream()
                .limit(5)
                .map(row -> new MonthlyStatsResponse.RankEntry(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    private List<MonthlyStatsResponse.TopShelfEntry> buildTopShelves() {
        return shelfRepository.findByIsPublicTrue()
                .stream()
                .filter(shelf -> shelf.getRatingCount() != null && shelf.getRatingCount() > 0)
                .sorted(Comparator.comparingDouble(
                        (Shelf s) -> s.getRatingAverage() == null ? 0.0 : s.getRatingAverage()
                ).reversed())
                .limit(3)
                .map(shelf -> new MonthlyStatsResponse.TopShelfEntry(
                        shelf.getId(),
                        shelf.getName(),
                        shelf.getOwner().getDisplayUsername(),
                        shelf.getRatingAverage(),
                        shelf.getRatingCount()
                ))
                .collect(Collectors.toList());
    }

    private List<MonthlyStatsResponse.RankEntry> buildPersonalMediaTypeRankings(Long userId) {
        return mediaItemRepository.countByTypeForOwner(userId)
                .stream()
                .sorted((a, b) -> Long.compare(
                        ((Number) b[1]).longValue(),
                        ((Number) a[1]).longValue()
                ))
                .limit(5)
                .map(row -> new MonthlyStatsResponse.RankEntry(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    private List<MonthlyStatsResponse.RankEntry> buildPersonalGenreRankings(Long userId) {
        return mediaItemRepository.countTopGenresForOwner(userId)
                .stream()
                .limit(5)
                .map(row -> new MonthlyStatsResponse.RankEntry(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .collect(Collectors.toList());
    }
}
