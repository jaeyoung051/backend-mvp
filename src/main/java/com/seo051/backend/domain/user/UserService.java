package com.seo051.backend.domain.user;

import com.seo051.backend.global.exception.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public UserResponse signup(UserSignupRequest req){
        if(userRepository.findByEmail(req.email()).isPresent()){
            throw new IllegalArgumentException("email already exists");
        }

        String encodedPassword = passwordEncoder.encode(req.password());

        User user = new User(
          req.email(),
          encodedPassword,
          req.name()
        );

        userRepository.save(user);

        return new UserResponse(
          user.getId(),
          user.getEmail(),
          user.getName()
        );
    }

    @Transactional(readOnly = true)
    public UserLoginResponse login(UserLoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("invalid email or password"));

        boolean matches = passwordEncoder.matches(req.password(), user.getPasswordHash());

        if (!matches) {
            throw new IllegalArgumentException("invalid email or password");
        }

        String accessToken = jwtProvider.createToken(user.getId(), user.getEmail());

        return new UserLoginResponse(
                accessToken,
                user.getId(),
                user.getEmail(),
                user.getName()
        );
    }
}