package org.testingdevsync.project2026.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.testingdevsync.project2026.dto.*;
import org.testingdevsync.project2026.service.GoalTrackingService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${cors.allowed-origins}")
@RequiredArgsConstructor
public class GoalTrackingController {
    
    private final GoalTrackingService service;
    
    @GetMapping("/month-data")
    public ResponseEntity<MonthDataResponse> getMonthData(
            @RequestParam String username,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(service.getMonthData(username, year, month));
    }
    
    @PostMapping("/goals")
    public ResponseEntity<Void> saveGoals(@RequestBody SaveGoalsRequest request) {
        service.saveGoals(request);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/mood")
    public ResponseEntity<Void> saveMood(@RequestBody SaveMoodRequest request) {
        service.saveMood(request);
        return ResponseEntity.ok().build();
    }
}
