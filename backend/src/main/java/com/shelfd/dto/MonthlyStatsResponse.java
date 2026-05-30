package com.shelfd.dto;

import java.util.List;

public class MonthlyStatsResponse {

    private List<RankEntry> topMediaTypes;
    private List<RankEntry> topGenres;
    private List<TopShelfEntry> topShelves;
    private List<RankEntry> personalTopMediaTypes;
    private List<RankEntry> personalTopGenres;

    public MonthlyStatsResponse(List<RankEntry> topMediaTypes,
                                List<RankEntry> topGenres,
                                List<TopShelfEntry> topShelves,
                                List<RankEntry> personalTopMediaTypes,
                                List<RankEntry> personalTopGenres) {
        this.topMediaTypes = topMediaTypes;
        this.topGenres = topGenres;
        this.topShelves = topShelves;
        this.personalTopMediaTypes = personalTopMediaTypes;
        this.personalTopGenres = personalTopGenres;
    }

    public List<RankEntry> getTopMediaTypes() { return topMediaTypes; }
    public List<RankEntry> getTopGenres() { return topGenres; }
    public List<TopShelfEntry> getTopShelves() { return topShelves; }
    public List<RankEntry> getPersonalTopMediaTypes() { return personalTopMediaTypes; }
    public List<RankEntry> getPersonalTopGenres() { return personalTopGenres; }

    public static class RankEntry {
        private String label;
        private long count;

        public RankEntry(String label, long count) {
            this.label = label;
            this.count = count;
        }

        public String getLabel() { return label; }
        public long getCount() { return count; }
    }

    public static class TopShelfEntry {
        private Long id;
        private String name;
        private String ownerUsername;
        private Double ratingAverage;
        private Integer ratingCount;

        public TopShelfEntry(Long id, String name, String ownerUsername,
                             Double ratingAverage, Integer ratingCount) {
            this.id = id;
            this.name = name;
            this.ownerUsername = ownerUsername;
            this.ratingAverage = ratingAverage;
            this.ratingCount = ratingCount;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getOwnerUsername() { return ownerUsername; }
        public Double getRatingAverage() { return ratingAverage; }
        public Integer getRatingCount() { return ratingCount; }
    }
}
