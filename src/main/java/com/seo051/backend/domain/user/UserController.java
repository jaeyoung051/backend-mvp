package com.seo051.backend.domain.user;

import com.seo051.backend.global.exception.jwt.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtProvider jwtProvider;

    @PostMapping("/users/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody UserSignupRequest req) {
        UserResponse response = userService.signup(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/users/login")
    public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest req) {
        UserLoginResponse response = userService.login(req);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<MyInfoResponse> me(
            @RequestHeader("Authorization") String authHeader
    ){
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtProvider.getUserId(token);

        MyInfoResponse response = userService.me(userId);
        return ResponseEntity.ok(response);
    }

}
