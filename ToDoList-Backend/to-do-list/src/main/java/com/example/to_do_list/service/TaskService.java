package com.example.to_do_list.service;

import com.example.to_do_list.entity.Task;

import java.util.List;

public interface TaskService {
    List<Task> getAllTasks();
    Task createTask(Task task);
    Task updateTask(Long id, Task taskDetails);
    void deleteTask(Long id);

}
