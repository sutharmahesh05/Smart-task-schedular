// src/app/components/task-form/task-form.component.ts
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';

interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: number;
  dueDate?: Date;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnChanges {
  @Input() task: Task = {
    title: '',
    status: 'pending',
    priority: 3
  };
  @Output() taskSaved = new EventEmitter<void>();
  
  taskForm: FormGroup;
  formTitle = 'Add Task';
  error = '';
  
  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.createForm();
  }

  ngOnChanges(): void {
    this.taskForm = this.createForm();
    
    if (this.task._id) {
      this.formTitle = 'Edit Task';
      this.taskForm.patchValue({
        ...this.task,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null
      });
    } else {
      this.formTitle = 'Add Task';
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      status: ['pending'],
      priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      dueDate: [null]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const taskData = this.taskForm.value;
    
    if (this.task._id) {
      // Update existing task
      this.taskService.updateTask(this.task._id, taskData)
        .subscribe({
          next: () => this.taskSaved.emit(),
          error: (error) => {
            this.error = 'Failed to update task';
            console.error(error);
          }
        });
    } else {
      // Create new task
      this.taskService.createTask(taskData)
        .subscribe({
          next: () => this.taskSaved.emit(),
          error: (error) => {
            this.error = 'Failed to create task';
            console.error(error);
          }
        });
    }
  }

  cancel(): void {
    this.taskSaved.emit();
  }
}