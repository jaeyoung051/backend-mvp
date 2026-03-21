package com.seo051.backend.domain.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostCreateRequest (

        @NotBlank   // null, "", " " 막음
        @Size(max = 200) // 글자 수 제한
        String title,

        @NotBlank
        String content
) {}
