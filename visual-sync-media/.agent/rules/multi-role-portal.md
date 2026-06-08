---
trigger: always_on
---

---
name: multi-role-portal
description: Implements a scalable multi-role dashboard architecture with a central layout switcher and role-specific sidebars.
---

# Multi-Role Portal Skill

This skill allows Antigravity to implement or extend a multi-role dashboard system. It follows a 3-layer pattern:
1. **Auth Context**: Provides `user` and `role` state.
2. **Main Layout Switcher**: Redirects users to the correct layout based on their role.
3. **Role-Specific Layouts**: Each role gets its own Sidebar, Header, and Route Protection logic.

## Usage Instructions

### 1. Structure Analysis
When asked to implement or fix a multi-role system, first ensure the `AuthContext` provides a `role` field.

### 2. Implementation Pattern

#### A. Central Switcher ([MainLayout.jsx](file:///c:/Users/Asus/Documents/My%20projects/mytender2/src/layouts/MainLayout.jsx))
```javascript
export default function MainLayout() {
  const { role, user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  switch(role) {
    case 'admin': return <AdminLayout />;
    case 'client': return <ContractorLayout />;
    default: return <BidderLayout />;
  }
}
```

#### B. Role Layouts (`RoleLayout.jsx`)
Each role layout should:
- List its authorized routes.
- Use `useLocation()` to verify if the current path is allowed for that role.
- Provide a unique `Sidebar` component.
- Wrap an `<Outlet />` for child routes.

### 3. Route Protection Logic
Use an `isAuthorizedRoute` helper inside each layout to prevent "portal jumping":
```javascript
const isAuthorized = (path, userRole) => {
  if (EXPLICIT_ROUTES.includes(path)) return true;
  if (path.startsWith('/dynamic/')) return true;
  return false;
};
```

## Best Practices
- **Shared Routes**: Handle shared routes (like `/profile`) by letting the role layout decide if it should render or return `null` (passing control to the next layout in the switcher if necessary).
- **Graceful Fallbacks**: Always provide a loading state to prevent layout flickering during session hydration.
