import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuditLog } from '../models';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private http = inject(HttpClient);

    private _logs = signal<AuditLog[]>([]);
    private _loading = signal<boolean>(false);

    logs = this._logs.asReadonly();
    isLoading = this._loading.asReadonly();

    async fetchLogs() {
        try {
            this._loading.set(true);
            const res = await firstValueFrom(this.http.get<AuditLog[]>(`${environment.apiUrl}/audit-log`));
            this._logs.set(res);
        } catch (err) {
            console.error('Failed to load audit logs:', err);
        } finally {
            this._loading.set(false);
        }
    }
}
