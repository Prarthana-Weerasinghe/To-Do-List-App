package com.example.to_do_list.repo;

import com.example.to_do_list.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Long> {}

