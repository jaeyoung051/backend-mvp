package com.seo051.backend.domain.user;

public record UserLoginResponse(
        String accessToken,
        Long id,
        String email,
        String name
) {
}
