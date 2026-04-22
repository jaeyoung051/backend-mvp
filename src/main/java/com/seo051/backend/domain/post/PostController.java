package com.seo051.backend.domain.post;

import com.seo051.backend.global.exception.jwt.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final JwtProvider jwtProvider;

    public PostController(PostService postService, JwtProvider jwtProvider) {
        this.postService = postService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping
    public Map<String, Long> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PostCreateRequest req

    ) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtProvider.getUserId(token);

        Long id = postService.create(req, userId);
        return Map.of("id", id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest req
    ) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtProvider.getUserId(token);

        postService.update(id, req, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id
    ) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtProvider.getUserId(token);

        postService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public PostPageResponse list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "title_content") String searchType
    ) {
        return postService.list(page, size, keyword, searchType);
    }

    @GetMapping("/{id}")
    public PostResponse get(@PathVariable Long id) {
        return postService.get(id);
    }
}
