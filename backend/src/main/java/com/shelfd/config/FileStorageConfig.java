package com.shelfd.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path avatarsDir = Path.of("uploads", "avatars").toAbsolutePath();
        String avatarsPath = avatarsDir.toUri().toString();
        registry.addResourceHandler("/avatars/**").addResourceLocations(avatarsPath);
    }
}
