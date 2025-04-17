export class UserPermissionRule {
    private userRole: string;

    constructor(userRole: string) {
        this.userRole = userRole;
    }

    public canCreateUser(): boolean {
        return this.userRole === 'Admin';
    }

    public canUpdateUser(): boolean {
        return this.userRole === 'Admin' || this.userRole === 'Editor';
    }

    public canViewUser(): boolean {
        return this.userRole === 'Admin' || this.userRole === 'Editor' || this.userRole === 'Viewer';
    }

    public canDeleteUser(): boolean {
        return this.userRole === 'Admin';
    }
}