import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthStore } from '../../core/services/auth.store';
import { UserSettings, SettingsProfile, SettingsOrganization, SettingsSecurity, SettingsPreferences } from './settings.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private authStore = inject(AuthStore);

    // Mock initial data for preferences and security (since not in User model)
    private security: SettingsSecurity = {
        mfaEnabled: false,
        sessionTimeout: 30
    };
    private preferences: SettingsPreferences = {
        theme: 'system',
        defaultView: 'kanban',
        itemsPerPage: 20
    };

    getSettings(): Observable<UserSettings> {
        const user = this.authStore.user();
        if (!user) {
            // Return empty or throw error, but page guards should prevent this.
            // For safety return empty structure.
            return of({
                profile: { email: '', role: '', name: '' },
                organization: { id: '' },
                security: this.security,
                preferences: this.preferences
            });
        }

        const settings: UserSettings = {
            profile: {
                email: user.email,
                role: user.role,
                name: user.name || 'User' // Default name if not set
            },
            organization: {
                id: user.organizationId
            },
            security: this.security,
            preferences: this.preferences
        };

        return of(settings).pipe(delay(500));
    }

    updateProfile(profile: SettingsProfile): Observable<SettingsProfile> {
        // In a real app, we'd call API to update profile if possible.
        // For now, we just return the updated profile.
        // We could also potentially update the AuthStore user signal locally if we wanted immediate reflection elsewhere.
        return of(profile).pipe(delay(500));
    }

    updateOrganization(organization: SettingsOrganization): Observable<SettingsOrganization> {
        return of(organization).pipe(delay(500));
    }

    updateSecurity(security: SettingsSecurity): Observable<SettingsSecurity> {
        this.security = security;
        return of(security).pipe(delay(500));
    }

    updatePreferences(preferences: SettingsPreferences): Observable<SettingsPreferences> {
        this.preferences = preferences;
        return of(preferences).pipe(delay(500));
    }
}
