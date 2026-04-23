package com.seo051.backend.domain.user;

import java.util.List;

public record MyInfoResponse(
   Long id,
   String email,
   String name,
   List<MyPostResponse> posts
) {}
