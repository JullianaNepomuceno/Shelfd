package com.shelfd.dto;

import jakarta.validation.constraints.NotBlank;

public class ShelfRequest {

    @NotBlank(message = "Shelf name is required")
    private String name;

    private String description;
    private boolean isPublic = false;

    public String getName() { return name; }
    public String getDescription() { return description; }
    public boolean isPublic() { return isPublic; }
}
