package com.seo051.backend.domain.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByDeletedAtIsNullOrderByCreatedAtDesc();
    Optional<Post> findByIdAndDeletedAtIsNull(Long id);

    Page<Post> findAllByDeletedAtIsNull(Pageable pageable);

    Page<Post> findByDeletedAtIsNullAndTitleContainingIgnoreCase(
            String keyword,
            Pageable pageble
    );

    Page<Post> findByDeletedAtIsNullAndTitleContainingIgnoreCaseOrDeletedAtIsNullAndContentContainingIgnoreCase(
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );

    List<Post> findAllByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);
}
