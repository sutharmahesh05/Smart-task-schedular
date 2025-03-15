// src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: number;
  dueDate?: Date;
  createdAt?: Date;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks()
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load tasks';
          this.loading = false;
          console.error(error);
        }
      });
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id)
        .subscribe({
          next: () => {
            this.tasks = this.tasks.filter(task => task._id !== id);
          },
          error: (error) => {
            this.error = 'Failed to delete task';
            console.error(error);
          }
        });
    }
  }

  editTask(task: Task): void {
    this.selectedTask = { ...task };
  }

  addNewTask(): void {
    this.selectedTask = {
      title: '',
      status: 'pending',
      priority: 3
    };
  }

  onTaskSaved(): void {
    this.selectedTask = null;
    this.loadTasks();
  }

  getPriorityClass(priority: number): string {
    switch(priority) {
      case 1: return 'low-priority';
      case 2: return 'low-medium-priority';
      case 3: return 'medium-priority';
      case 4: return 'medium-high-priority';
      case 5: return 'high-priority';
      default: return '';
    }
  }
}