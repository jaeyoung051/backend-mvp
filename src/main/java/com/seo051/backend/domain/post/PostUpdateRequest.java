package com.seo051.backend.domain.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostUpdateRequest (
    @NotBlank // NotBlank는 값이 null 이 아닌 "" 빈값들을 막아주는것 " "를 문자열로 인식
    @Size(max = 200) // db error를 api error로 바꾸기 500자 제목 db error -> controller에서 차단 400 Bad Request
    String title,
    @NotBlank
    String content
) {}