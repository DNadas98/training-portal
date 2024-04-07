package net.dnadas.training_portal.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.requests.GroupJoinRequestResponseDto;
import net.dnadas.training_portal.dto.requests.GroupJoinRequestUpdateDto;
import net.dnadas.training_portal.service.group.GroupRequestService;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/groups/{groupId}/requests")
public class GroupRequestController {
  private final GroupRequestService requestService;
  private final MessageSource messageSource;

  @GetMapping()
  public ResponseEntity<?> readJoinRequestsOfGroup(
    @PathVariable @Min(1) Long groupId, @RequestParam @Min(1) Integer page,
    @RequestParam @Min(1) @Max(50) Integer size, @RequestParam(required = false) String search) {
    String decodedSearch = URLDecoder.decode(search, StandardCharsets.UTF_8);
    //TODO: sanitize search input
    Page<GroupJoinRequestResponseDto> requests =
      requestService.getJoinRequestsOfGroup(groupId, decodedSearch,
        PageRequest.of(page - 1, size));
    Map<String, Object> response = new HashMap<>();
    response.put("data", requests.getContent());
    response.put("totalPages", requests.getTotalPages());
    response.put("currentPage", requests.getNumber() + 1);
    response.put("totalItems", requests.getTotalElements());
    response.put("size", requests.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping()
  public ResponseEntity<?> joinGroup(@PathVariable @Min(1) Long groupId, Locale locale) {
    GroupJoinRequestResponseDto createdRequest = requestService.createJoinRequest(groupId);

    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message",
        messageSource.getMessage("group.requests.create.success", null, locale),
        "data", createdRequest));
  }

  @PutMapping("/{requestId}")
  public ResponseEntity<?> updateJoinRequestById(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long requestId,
    @RequestBody @Valid GroupJoinRequestUpdateDto requestDto, Locale locale) {

    requestService.handleJoinRequest(groupId, requestId, requestDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.requests.update.success", null, locale)));
  }
}