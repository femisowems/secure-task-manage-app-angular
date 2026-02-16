import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private http = inject(HttpClient);

    private _tasks = signal<Task[]>([]);
    private _loading = signal<boolean>(false);
    private _error = signal<string>('');

    tasks = this._tasks.asReadonly();
    isLoading = this._loading.asReadonly();
    error = this._error.asReadonly();

    async fetchTasks() {
        try {
            this._loading.set(true);
            const res = await firstValueFrom(this.http.get<Task[]>(`${environment.apiUrl}/tasks`));
            this._tasks.set(res);
            this._error.set('');
        } catch (err) {
            this._error.set('Failed to load tasks');
        } finally {
            this._loading.set(false);
        }
    }

    async createTask(data: Partial<Task>) {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/tasks`, data));
        await this.fetchTasks();
    }

    async updateTask(id: string, data: Partial<Task>) {
        await firstValueFrom(this.http.put(`${environment.apiUrl}/tasks/${id}`, data));
        await this.fetchTasks();
    }

    async deleteTask(id: string) {
        await firstValueFrom(this.http.delete(`${environment.apiUrl}/tasks/${id}`));
        await this.fetchTasks();
    }
}
