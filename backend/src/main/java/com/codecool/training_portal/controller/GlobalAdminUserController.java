package com.codecool.training_portal.controller;

import com.codecool.training_portal.service.auth.ApplicationUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class GlobalAdminUserController {
    private final ApplicationUserService applicationUserService;
    private final MessageSource messageSource;

    /*@GetMapping
    public ResponseEntity<?> getAllApplicationUsers() {
        List<UserResponsePublicDto> users = applicationUserService.getAllApplicationUsers();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationUserById(@PathVariable @Min(1) Long id) {
        UserResponsePrivateDto user = applicationUserService.getApplicationUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplicationUserById(@PathVariable @Min(
            1) Long id, Locale locale) {
        applicationUserService.archiveApplicationUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("message", messageSource.getMessage("user.delete.success", null, locale)));
    }*/
}
