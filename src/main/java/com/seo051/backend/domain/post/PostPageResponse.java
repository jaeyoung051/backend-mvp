package com.seo051.backend.domain.post;

import java.util.List;

public record PostPageResponse(
   List<PostListItemResponse> content,
   int page,
   int size,
   long totalElements,
   int totalPages,
   boolean first,
   boolean last
) {}
