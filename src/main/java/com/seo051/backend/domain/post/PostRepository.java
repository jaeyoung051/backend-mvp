package com.seo051.backend.domain.post;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByDeletedAtIsNullOrderByCreatedAtDesc();
    Optional<Post> findByIdAndDeletedAtIsNull(Long id);
}
