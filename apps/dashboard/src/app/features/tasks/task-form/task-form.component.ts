import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus, TaskCategory, TaskPriority } from '../../../core/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="submit()" class="space-y-grid-md">
      <div>
        <label class="block text-body-sm font-semibold text-text-primary mb-1">Title</label>
        <input formControlName="title" type="text"
               class="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary"
               placeholder="Enter task title">
      </div>

      <div>
        <label class="block text-body-sm font-semibold text-text-primary mb-1">Description</label>
        <textarea formControlName="description" rows="3"
                  class="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary"
                  placeholder="Enter task description"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div>
          <label class="block text-body-sm font-semibold text-text-primary mb-1">Category</label>
          <select formControlName="category"
                  class="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary">
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-body-sm font-semibold text-text-primary mb-1">Status</label>
          <select formControlName="status"
                  class="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary">
            @for (status of statuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-body-sm font-semibold text-text-primary mb-1">Priority</label>
          <select formControlName="priority"
                  class="block w-full px-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body text-text-primary">
            @for (priority of priorities; track priority) {
              <option [value]="priority">{{ priority }}</option>
            }
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-grid-md pt-grid-lg border-t border-border-subtle">
        <button type="button" (click)="cancel.emit()"
                class="px-grid-md py-grid-sm text-body-sm font-medium text-text-secondary bg-surface border border-border-subtle rounded-md hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" [disabled]="taskForm.invalid"
                class="px-grid-md py-grid-sm text-body-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-colors">
          {{ isEditing ? 'Update Task' : 'Create Task' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() task?: Task;
  @Output() onSubmit = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  categories = Object.values(TaskCategory);
  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: [TaskCategory.WORK, [Validators.required]],
    status: [TaskStatus.TODO, [Validators.required]],
    priority: [TaskPriority.MEDIUM, [Validators.required]]
  });

  get isEditing(): boolean {
    return !!this.task;
  }

  ngOnInit() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        category: this.task.category,
        status: this.task.status,
        priority: this.task.priority
      });
    }
  }

  submit() {
    if (this.taskForm.valid) {
      this.onSubmit.emit(this.taskForm.value as Partial<Task>);
    }
  }
}
