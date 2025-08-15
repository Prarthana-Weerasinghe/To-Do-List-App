package com.example.to_do_list.service.impl;

import com.example.to_do_list.entity.Task;
import com.example.to_do_list.repo.TaskRepo;
import com.example.to_do_list.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceIMPL implements TaskService {
    @Autowired
    private TaskRepo taskRepo;

    @Override
    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    @Override
    public Task createTask(Task task) {
        return taskRepo.save(task);
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        Task existingTask = taskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        existingTask.setTaskName(taskDetails.getTaskName());
        existingTask.setCompleted(taskDetails.isCompleted());
        return taskRepo.save(existingTask);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepo.deleteById(id);
    }
}
