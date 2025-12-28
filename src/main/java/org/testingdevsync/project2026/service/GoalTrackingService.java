package org.testingdevsync.project2026.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.testingdevsync.project2026.dto.*;
import org.testingdevsync.project2026.entity.*;
import org.testingdevsync.project2026.repository.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalTrackingService {
    
    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final TaskRepository taskRepository;
    private final TaskCompletionRepository taskCompletionRepository;
    private final MoodRepository moodRepository;
    
    @Transactional
    public MonthDataResponse getMonthData(String username, int year, int month) {
        User user = userRepository.findByUsername(username)
            .orElseGet(() -> userRepository.save(createUser(username)));
        
        List<Goal> goals = goalRepository.findByUserIdAndDeletedAtIsNull(user.getId());
        List<GoalDTO> goalDTOs = goals.stream()
            .map(goal -> convertToDTO(goal, year, month))
            .collect(Collectors.toList());
        
        List<Mood> moods = moodRepository.findByUserIdAndYearAndMonth(
            user.getId(), (short) year, (byte) (month + 1));
        Map<String, String> moodMap = moods.stream()
            .collect(Collectors.toMap(
                m -> m.getMoodDate().toString(),
                Mood::getEmoji
            ));
        
        MonthDataResponse response = new MonthDataResponse();
        response.setGoals(goalDTOs);
        response.setMoods(moodMap);
        return response;
    }
    
    @Transactional
    public void saveGoals(SaveGoalsRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseGet(() -> userRepository.save(createUser(request.getUsername())));
        
        for (GoalDTO goalDTO : request.getGoals()) {
            Goal goal = goalRepository.findByUserIdAndGoalIdAndDeletedAtIsNull(user.getId(), goalDTO.getId())
                .orElseGet(() -> createGoal(user.getId(), goalDTO));
            goal.setName(goalDTO.getName());
            goalRepository.save(goal);
            
            for (TaskDTO taskDTO : goalDTO.getTasks()) {
                Task task = taskRepository.findByGoalIdAndTaskIdAndDeletedAtIsNull(goal.getId(), taskDTO.getId())
                    .orElseGet(() -> createTask(goal.getId(), taskDTO));
                task.setName(taskDTO.getName());
                task.setDescription(taskDTO.getDescription());
                taskRepository.save(task);
                
                saveTaskCompletions(task.getId(), taskDTO.getWeekCompletions(), request.getYear(), request.getMonth());
            }
        }
    }
    
    @Transactional
    public void saveMood(SaveMoodRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseGet(() -> userRepository.save(createUser(request.getUsername())));
        
        LocalDate date = LocalDate.parse(request.getDate());
        Mood mood = moodRepository.findByUserIdAndMoodDate(user.getId(), date)
            .orElseGet(() -> createMood(user.getId(), date));
        mood.setEmoji(request.getEmoji());
        moodRepository.save(mood);
    }
    
    private User createUser(String username) {
        User user = new User();
        user.setUsername(username);
        return user;
    }
    
    private Goal createGoal(Long userId, GoalDTO dto) {
        Goal goal = new Goal();
        goal.setUserId(userId);
        goal.setGoalId(dto.getId());
        goal.setName(dto.getName());
        return goal;
    }
    
    private Task createTask(Long goalId, TaskDTO dto) {
        Task task = new Task();
        task.setGoalId(goalId);
        task.setTaskId(dto.getId());
        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        return task;
    }
    
    private Mood createMood(Long userId, LocalDate date) {
        Mood mood = new Mood();
        mood.setUserId(userId);
        mood.setMoodDate(date);
        mood.setYear((short) date.getYear());
        mood.setMonth((byte) date.getMonthValue());
        mood.setDay((byte) date.getDayOfMonth());
        return mood;
    }
    
    private GoalDTO convertToDTO(Goal goal, int year, int month) {
        GoalDTO dto = new GoalDTO();
        dto.setId(goal.getGoalId());
        dto.setName(goal.getName());
        
        List<Task> tasks = taskRepository.findByGoalIdAndDeletedAtIsNull(goal.getId());
        dto.setTasks(tasks.stream()
            .map(task -> convertTaskToDTO(task, year, month))
            .collect(Collectors.toList()));
        
        return dto;
    }
    
    private TaskDTO convertTaskToDTO(Task task, int year, int month) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getTaskId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        
        List<TaskCompletion> completions = taskCompletionRepository
            .findByTaskIdAndYearAndMonth(task.getId(), (short) year, (byte) (month + 1));
        dto.setWeekCompletions(buildWeekCompletions(completions, year, month));
        
        return dto;
    }
    
    private boolean[][] buildWeekCompletions(List<TaskCompletion> completions, int year, int month) {
        Map<LocalDate, Boolean> completionMap = completions.stream()
            .collect(Collectors.toMap(TaskCompletion::getCompletionDate, TaskCompletion::getIsCompleted));
        
        int daysInMonth = LocalDate.of(year, month + 1, 1).lengthOfMonth();
        boolean[][] weeks = new boolean[5][7];
        
        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = LocalDate.of(year, month + 1, day);
            int weekIndex = (day - 1) / 7;
            int dayIndex = (day - 1) % 7;
            weeks[weekIndex][dayIndex] = completionMap.getOrDefault(date, false);
        }
        
        return weeks;
    }
    
    private void saveTaskCompletions(Long taskId, boolean[][] weekCompletions, int year, int month) {
        for (int week = 0; week < weekCompletions.length; week++) {
            for (int day = 0; day < weekCompletions[week].length; day++) {
                int dayOfMonth = week * 7 + day + 1;
                LocalDate date = LocalDate.of(year, month + 1, dayOfMonth);
                
                TaskCompletion completion = taskCompletionRepository
                    .findByTaskIdAndCompletionDate(taskId, date)
                    .orElseGet(() -> createTaskCompletion(taskId, date));
                completion.setIsCompleted(weekCompletions[week][day]);
                taskCompletionRepository.save(completion);
            }
        }
    }
    
    private TaskCompletion createTaskCompletion(Long taskId, LocalDate date) {
        TaskCompletion completion = new TaskCompletion();
        completion.setTaskId(taskId);
        completion.setCompletionDate(date);
        completion.setYear((short) date.getYear());
        completion.setMonth((byte) date.getMonthValue());
        completion.setDay((byte) date.getDayOfMonth());
        return completion;
    }
}
