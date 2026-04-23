package com.seo051.backend.domain.user;

import java.time.LocalDateTime;

public record MyPostResponse(
   Long id,
   String title,
   LocalDateTime createdAt
) {}
