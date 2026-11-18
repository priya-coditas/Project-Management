# ESLint Fixes

**Result:** `npm run lint` and `npx tsc -b` both pass. No lint rules were disabled.

There were 6 kinds of problems:

1. [`any` types in the access HOCs](#1-any-types-in-the-access-hocs)
2. [`any` types in `catch` blocks](#2-any-types-in-catch-blocks)
3. [`any` type for pagination data](#3-any-type-for-pagination-data)
4. [`const` declared inside a `case`](#4-const-declared-inside-a-case)
5. [Fast refresh errors](#5-fast-refresh-errors)
6. [Missing `useEffect` dependency](#6-missing-useeffect-dependency)

---

## 1. `any` types in the access HOCs

**Rule:** `@typescript-eslint/no-explicit-any`

**Files:**
- `src/HOC/withAdminAccess.tsx`
- `src/HOC/withProjectAccess.tsx`
- `src/HOC/withSuperAdminAccess.tsx`

**What changed:** Each HOC now has an interface listing the props it passes down. The wrapped component's own props use a generic type `P` instead of `any`.

```tsx
export interface AdminAccessProps {
  isAdmin: boolean;
  canViewUsers: boolean;
  role: string;
}

function withAdminAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function AdminAccessComponent(props: Omit<P, keyof AdminAccessProps>) {
```

`Omit` means callers don't have to pass `isAdmin`, `canDelete` etc. themselves. The HOC supplies them.

**Props each HOC passes down:**

| HOC | Props |
| --- | --- |
| `withAdminAccess` | `isAdmin`, `canViewUsers`, `role` |
| `withProjectAccess` | `role`, `isAdmin`, `canCreateProject`, `canEditProject`, `canDeleteProject` |
| `withSuperAdminAccess` | `role`, `isSuperAdmin`, `isAdmin`, `canDelete`, `canToggleStatus` |

---

## 2. `any` types in `catch` blocks

**Rule:** `@typescript-eslint/no-explicit-any`

**Files:** `Login`, `Profile`, `CreateProject`, `EditProject`, `ProjectDetail`, `ProjectView`, `CreateUser`, `EditUser`, `UsersList`

**What changed:** `err` is no longer typed as `any`. We check that it is an axios error before reading the message.

Before:

```tsx
} catch (err: any) {
  const errorMessage = err.response?.data?.message;
```

After:

```tsx
} catch (err) {
  const errorMessage = axios.isAxiosError<{ message?: string | string[] }>(err)
    ? err.response?.data?.message
    : undefined;
```

The error messages shown to the user are unchanged.

---

## 3. `any` type for pagination data

**Rule:** `@typescript-eslint/no-explicit-any`

**Files:** `ProjectView`, `UsersList`

**What changed:**

```tsx
let paginationData: Partial<Record<string, number>> | null = null;
```

The API can return different field names (`page` or `currentPage`, `total` or `totalProjects`). This type accepts any field name, as long as the value is a number.

---

## 4. `const` declared inside a `case`

**Rule:** `no-case-declarations`

**Files:** `CreateUser`, `EditUser`

**What changed:** The `case 'email':` body is wrapped in `{ }`, so `emailRegex` only exists inside that case.

```tsx
case 'email': {
  if (!value.trim()) return ERROR_EMAIL_REQUIRED;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return ERROR_EMAIL_INVALID;
  return '';
}
```

---

## 5. Fast refresh errors

**Rule:** `react-refresh/only-export-components`

Vite's fast refresh (instant reload while editing) only works when a file exports named components.

**`main.tsx`**

`AppWrapper` was defined in `main.tsx`, which exports nothing. It now lives in its own file, `src/AppWrapper.tsx`. `main.tsx` just imports and renders it.

**`DashboardComponent`, `ProjectView`, `UsersList`**

`export default withX(Component)` creates a component with no name. Each one is now given a name first:

```tsx
const UsersListWithAccess = withSuperAdminAccess(UsersList);
export default UsersListWithAccess;
```

---

## 6. Missing `useEffect` dependency

**Rule:** `react-hooks/exhaustive-deps` (warning)

**File:** `ProjectView`

**What changed:** `fetchProjects` is wrapped in `useCallback`, so it can safely be listed as a dependency.

```tsx
const fetchProjects = useCallback(async (page: number = 1) => {
  // ...
}, [userId]);

useEffect(() => {
  if (userId) {
    fetchProjects(1);
  }
}, [userId, fetchProjects]);
```

Projects still only reload when `userId` changes.

---

## How to check

```bash
npm run lint   # should show no errors or warnings
npx tsc -b     # should show no type errors
```
