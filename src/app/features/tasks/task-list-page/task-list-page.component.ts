import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { LucideAngularModule } from 'lucide-angular';
import { TaskService } from '../../../core/services/task.service';
import { AuthStore } from '../../../core/services/auth.store';
import { UserRole, Task, TaskStatus, TaskCategory, TaskPriority } from '../../../core/models';
import { TaskFormComponent } from '../task-form/task-form.component';

type SortOption = 'newest' | 'oldest' | 'priority' | 'title';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TaskFormComponent, FormsModule, DragDropModule],
  template: `
    <div class="max-w-8xl mx-auto space-y-grid-xl">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-grid-md">
        <h1 class="text-h1 font-bold text-text-primary">Tasks</h1>
        
        <div class="flex flex-wrap items-center gap-grid-md w-full md:w-auto">
          <!-- Search -->
          <div class="relative flex-1 md:w-64">
            <lucide-icon name="search" class="absolute left-grid-md top-1/2 -translate-y-1/2 text-text-secondary" [size]="18"></lucide-icon>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Search tasks..."
              class="w-full pl-grid-lg pr-grid-md py-grid-sm bg-surface border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-body-sm text-text-primary"
            >
          </div>

          <!-- Category Filter -->
          <div class="relative text-sm">
            <lucide-icon name="filter" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" [size]="16"></lucide-icon>
            <select
              [ngModel]="categoryFilter()"
              (ngModelChange)="categoryFilter.set($event)"
              class="appearance-none pl-8 pr-10 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>

          <!-- Sort -->
          <div class="relative text-sm">
            <lucide-icon name="sort-asc" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" [size]="16"></lucide-icon>
            <select
              [ngModel]="sortBy()"
              (ngModelChange)="sortBy.set($event)"
              class="appearance-none pl-8 pr-10 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">High Priority</option>
              <option value="title">A-Z</option>
            </select>
          </div>

          <button
            (click)="openCreate()"
            class="flex items-center gap-grid-sm px-grid-md py-grid-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <lucide-icon name="plus" [size]="20"></lucide-icon>
            New Task
          </button>
        </div>
      </div>

      @if (taskService.isLoading()) {
        <div class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading your tasks...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-grid-lg" cdkDropListGroup>
          <!-- TODO Column -->
          <div class="flex flex-col h-full bg-surface-glass backdrop-blur-md rounded-card p-grid-md border border-border-subtle shadow-sm">
            <h2 class="text-h4 font-bold text-text-primary flex items-center gap-grid-sm mb-grid-lg px-grid-sm uppercase tracking-wider text-caption">
              <span class="w-2 h-2 rounded-full bg-gray-400"></span>
              To Do
              <span class="bg-gray-100 text-text-secondary px-grid-sm py-0.5 rounded ml-auto text-caption font-medium">{{ todoTasks().length }}</span>
            </h2>
            
            <div
              cdkDropList
              [cdkDropListData]="todoTasks()"
              (cdkDropListDropped)="drop($event, statusMap.TODO)"
              class="flex-1 space-y-grid-md min-h-[500px]"
            >
              @for (task of todoTasks(); track task.id) {
                <div cdkDrag class="bg-surface p-grid-lg rounded-card shadow-sm border border-border-subtle cursor-move hover:shadow-md transition-all active:scale-95 group">
                  <div class="flex flex-col gap-grid-sm">
                    <div class="flex justify-between items-start">
                      <span [class]="'px-grid-sm py-0.5 text-caption font-bold uppercase rounded-pill ' + getCategoryClass(task.category)">
                        {{ task.category }}
                      </span>
                      <span [class]="'text-caption font-bold uppercase ' + getPriorityColor(task.priority)">
                        {{ task.priority }}
                      </span>
                    </div>
                    <h3 class="text-body font-semibold text-text-primary leading-tight">{{ task.title }}</h3>
                    <p class="text-body-sm text-text-secondary line-clamp-2">{{ task.description }}</p>
                    <div class="flex justify-end gap-grid-sm mt-grid-md opacity-0 group-hover:opacity-100 transition-opacity">
                      @if (canEdit()) {
                        <button (click)="openEdit(task)" class="text-text-secondary hover:text-indigo-600">
                          <lucide-icon name="pencil" [size]="14"></lucide-icon>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- IN PROGRESS Column -->
          <div class="flex flex-col h-full bg-blue-50/30 backdrop-blur-sm rounded-card p-grid-md border border-blue-100 shadow-sm">
            <h2 class="text-h4 font-bold text-blue-800 flex items-center gap-grid-sm mb-grid-lg px-grid-sm uppercase tracking-wider text-caption">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              In Progress
              <span class="bg-blue-100 text-blue-700 px-grid-sm py-0.5 rounded ml-auto text-caption font-medium">{{ inProgressTasks().length }}</span>
            </h2>
            
            <div
              cdkDropList
              [cdkDropListData]="inProgressTasks()"
              (cdkDropListDropped)="drop($event, statusMap.IN_PROGRESS)"
              class="flex-1 space-y-grid-md min-h-[500px]"
            >
              @for (task of inProgressTasks(); track task.id) {
                <div cdkDrag class="bg-surface p-grid-lg rounded-card shadow-sm border border-border-subtle cursor-move hover:shadow-md transition-all active:scale-95 group">
                   <div class="flex flex-col gap-grid-sm">
                    <div class="flex justify-between items-start">
                      <span [class]="'px-grid-sm py-0.5 text-caption font-bold uppercase rounded-pill ' + getCategoryClass(task.category)">
                        {{ task.category }}
                      </span>
                      <span [class]="'text-caption font-bold uppercase ' + getPriorityColor(task.priority)">
                        {{ task.priority }}
                      </span>
                    </div>
                    <h3 class="text-body font-semibold text-text-primary leading-tight">{{ task.title }}</h3>
                    <p class="text-body-sm text-text-secondary line-clamp-2">{{ task.description }}</p>
                    <div class="flex justify-end gap-grid-sm mt-grid-md opacity-0 group-hover:opacity-100 transition-opacity">
                      @if (canEdit()) {
                        <button (click)="openEdit(task)" class="text-text-secondary hover:text-indigo-600">
                          <lucide-icon name="pencil" [size]="14"></lucide-icon>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- COMPLETED Column -->
          <div class="flex flex-col h-full bg-green-50/30 backdrop-blur-sm rounded-card p-grid-md border border-green-100 shadow-sm">
            <h2 class="text-h4 font-bold text-green-800 flex items-center gap-grid-sm mb-grid-lg px-grid-sm uppercase tracking-wider text-caption">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              Completed
              <span class="bg-green-100 text-green-700 px-grid-sm py-0.5 rounded ml-auto text-caption font-medium">{{ completedTasks().length }}</span>
            </h2>
            
            <div
              cdkDropList
              [cdkDropListData]="completedTasks()"
              (cdkDropListDropped)="drop($event, statusMap.COMPLETED)"
              class="flex-1 space-y-grid-md min-h-[500px]"
            >
              @for (task of completedTasks(); track task.id) {
                <div cdkDrag class="bg-surface p-grid-lg rounded-card shadow-sm border border-border-subtle cursor-move hover:shadow-md transition-all active:scale-95 group opacity-75">
                   <div class="flex flex-col gap-grid-sm">
                    <div class="flex justify-between items-start">
                      <span [class]="'px-grid-sm py-0.5 text-caption font-bold uppercase rounded-pill ' + getCategoryClass(task.category)">
                        {{ task.category }}
                      </span>
                    </div>
                    <h3 class="text-body font-semibold text-text-primary leading-tight line-through opacity-50">{{ task.title }}</h3>
                    <div class="flex justify-end gap-grid-sm mt-grid-md">
                      @if (canEdit()) {
                        <div class="flex gap-grid-sm">
                          <button (click)="openEdit(task)" class="text-text-secondary hover:text-indigo-600">
                            <lucide-icon name="pencil" [size]="14"></lucide-icon>
                          </button>
                          <button (click)="deleteTask(task.id)" class="text-text-secondary hover:text-red-600">
                            <lucide-icon name="trash-2" [size]="14"></lucide-icon>
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (isModalOpen()) {
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-grid-md z-50">
          <div class="bg-surface rounded-modal w-full max-w-md p-grid-xl relative shadow-2xl border border-border-subtle">
            <button
              (click)="isModalOpen.set(false)"
              class="absolute top-grid-md right-grid-md text-text-secondary hover:text-text-primary transition-colors"
            >
              <lucide-icon name="x" [size]="24"></lucide-icon>
            </button>
            <h2 class="text-h3 font-bold mb-grid-lg text-text-primary">{{ editingTask() ? 'Edit Task' : 'New Task' }}</h2>
            
            <app-task-form
              [task]="editingTask() || undefined"
              (onSubmit)="editingTask() ? handleUpdate($event) : handleCreate($event)"
              (cancel)="isModalOpen.set(false)"
            ></app-task-form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cdk-drag-preview {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .cdk-drag-placeholder { opacity: 0; }
    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .cdk-drop-list-dragging .cdk-drag { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class TaskListPageComponent implements OnInit {
  public taskService = inject(TaskService);
  private authStore = inject(AuthStore);

  tasks = this.taskService.tasks;
  user = this.authStore.user;
  canEdit = computed(() => this.user()?.role !== UserRole.VIEWER);

  categories = Object.values(TaskCategory);
  statusMap = TaskStatus;

  // Filters & Search
  searchQuery = signal('');
  categoryFilter = signal<TaskCategory | 'all'>('all');
  sortBy = signal<SortOption>('newest');

  // Computed filtered and sorted tasks
  filteredTasks = computed(() => {
    let result = this.tasks();

    // 1. Search
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    const cat = this.categoryFilter();
    if (cat !== 'all') {
      result = result.filter(t => t.category === cat);
    }

    // 3. Sorting
    result = [...result].sort((a, b) => {
      switch (this.sortBy()) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority': {
          const pMap: Record<string, number> = { [TaskPriority.HIGH]: 3, [TaskPriority.MEDIUM]: 2, [TaskPriority.LOW]: 1 };
          return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
        }
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    return result;
  });

  todoTasks = computed(() => this.filteredTasks().filter(t => t.status === TaskStatus.TODO));
  inProgressTasks = computed(() => this.filteredTasks().filter(t => t.status === TaskStatus.IN_PROGRESS));
  completedTasks = computed(() => this.filteredTasks().filter(t => t.status === TaskStatus.COMPLETED));

  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);

  ngOnInit() {
    this.taskService.fetchTasks();
  }

  resetFilters() {
    this.searchQuery.set('');
    this.categoryFilter.set('all');
    this.sortBy.set('newest');
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    if (event.previousContainer !== event.container) {
      const task = event.previousContainer.data[event.previousIndex];
      this.taskService.updateTask(task.id, { status: newStatus });
    }
  }

  getCategoryClass(category: string) {
    const classes: Record<string, string> = {
      [TaskCategory.WORK]: 'bg-indigo-50 text-indigo-700',
      [TaskCategory.PERSONAL]: 'bg-emerald-50 text-emerald-700',
      [TaskCategory.SHOPPING]: 'bg-amber-50 text-amber-700',
      [TaskCategory.OTHER]: 'bg-slate-50 text-slate-700'
    };
    return classes[category] || classes[TaskCategory.OTHER];
  }

  getPriorityColor(priority: string) {
    const classes: Record<string, string> = {
      [TaskPriority.HIGH]: 'text-red-600',
      [TaskPriority.MEDIUM]: 'text-orange-500',
      [TaskPriority.LOW]: 'text-sky-500'
    };
    return classes[priority] || classes[TaskPriority.LOW];
  }

  openCreate() {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  openEdit(task: Task) {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  handleCreate(data: Partial<Task>) {
    this.taskService.createTask(data);
    this.isModalOpen.set(false);
  }

  handleUpdate(data: Partial<Task>) {
    const task = this.editingTask();
    if (task) {
      this.taskService.updateTask(task.id, data);
      this.editingTask.set(null);
      this.isModalOpen.set(false);
    }
  }
}
