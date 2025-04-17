"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionRule = void 0;
class UserPermissionRule {
    constructor(userRole) {
        this.userRole = userRole;
    }
    canCreateUser() {
        return this.userRole === 'Admin';
    }
    canUpdateUser() {
        return this.userRole === 'Admin' || this.userRole === 'Editor';
    }
    canViewUser() {
        return this.userRole === 'Admin' || this.userRole === 'Editor' || this.userRole === 'Viewer';
    }
    canDeleteUser() {
        return this.userRole === 'Admin';
    }
}
exports.UserPermissionRule = UserPermissionRule;
