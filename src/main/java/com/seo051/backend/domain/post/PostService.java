package com.seo051.backend.domain.post;

import com.seo051.backend.domain.user.User;
import com.seo051.backend.domain.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public Long create(PostCreateRequest req) { // 유저 존재 확인
        User user = userRepository.findById(req.userId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        Post post = new Post(req.title(), req.content(), user);
        postRepository.save(post);

        return post.getId();
    }

    public void update(Long id, PostUpdateRequest req) { // 변경 감지(Dirty Checking) 있어서 영속상태로 들어옴 save 필요없음
        Post post = postRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        post.update(req.title(), req.content());
    }

    public void delete(Long id) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
        post.softDelete();
    }

    @Transactional(readOnly = true)
    public List<PostResponse> list() { // 글 목록
        return postRepository.findAllByDeletedAtIsNullOrderByCreatedAtDesc().stream()
                .map(p -> new PostResponse(
                        p.getId(),
                        p.getTitle(),
                        p.getContent(),
                        p.getUser().getId()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse get(Long id) { // 글 정보 가져오기
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
