export enum UserRole {
    OWNER = 'Owner',
    ADMIN = 'Admin',
    VIEWER = 'Viewer',
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    organizationId: string;
    name?: string;
}

export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
}

export enum TaskCategory {
    WORK = 'Work',
    PERSONAL = 'Personal',
    SHOPPING = 'Shopping',
    OTHER = 'Other',
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export interface Task {
    id: string;
    title: string;
    description: string;
    category: TaskCategory;
    status: TaskStatus;
    priority: TaskPriority;
    organizationId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    timestamp: string;
}
