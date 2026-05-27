package com.shelfd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class ShelfRequest {

    @NotBlank(message = "Shelf name is required")
    private String name;

    private String description;

    @JsonProperty("isPublic")
    private boolean isPublic = false;

    public String getName() { return name; }
    public String getDescription() { return description; }
    public boolean isPublic() { return isPublic; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }

    @JsonProperty("isPublic")
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
}
