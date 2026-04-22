package com.seo051.backend.domain.post;

import com.seo051.backend.domain.user.User;
import com.seo051.backend.domain.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public Long create(PostCreateRequest req, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        Post post = new Post(req.title(), req.content(), user);
        postRepository.save(post);

        return post.getId();
    }

    public void update(Long id, PostUpdateRequest req, Long userId) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("forbidden");
        }

        post.update(req.title(), req.content());
    }

    public void delete(Long id, Long userId) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("forbidden");
        }

        post.softDelete();
    }

    @Transactional(readOnly = true)
    public PostPageResponse list(int page, int size, String keyword, String searchType) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Post> result;

        boolean hasKeyword = keyword != null && !keyword.isBlank();

        if (!hasKeyword) {
            result = postRepository.findAllByDeletedAtIsNull(pageable);
        } else if ("title".equalsIgnoreCase(searchType)) {
            result = postRepository.findByDeletedAtIsNullAndTitleContainingIgnoreCase(keyword, pageable);
        } else {
            result = postRepository
                    .findByDeletedAtIsNullAndTitleContainingIgnoreCaseOrDeletedAtIsNullAndContentContainingIgnoreCase(
                            keyword,
                            keyword,
                            pageable
                    );
        }

        return new PostPageResponse(
                result.getContent().stream()
                        .map(p -> new PostListItemResponse(
                                p.getId(),
                                p.getTitle(),
                                p.getUser().getId(),
                                p.getCreatedAt()
                        ))
                        .toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isFirst(),
                result.isLast()
        );
    }

    @Transactional(readOnly = true)
    public PostResponse get(Long id) {
        Post p = postRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        return new PostResponse(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                p.getUser().getId()
        );
    }

    public PostService(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }
}