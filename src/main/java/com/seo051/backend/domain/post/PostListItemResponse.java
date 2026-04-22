package com.seo051.backend.domain.post;

import java.time.LocalDateTime;

public record PostListItemResponse (
    Long id,
    String title,
    Long userId,
    LocalDateTime createdAt
) {}
