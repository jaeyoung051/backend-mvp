package com.seo051.backend.domain.user;

public record UserResponse(
        Long id,
        String email,
        String name
) {}
