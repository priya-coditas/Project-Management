// Navigation
export const DASHBOARD: string = "Dashboard";
export const PROFILE: string = "Profile";
export const LOGOUT: string = "Logout";
export const LOGIN: string = "Login";
export const REMEMBER_ME: string = "Remember Me";

// Users
export const USERS: string = "Users";
export const CREATE_USER: string = "Create User";
export const CREATE_NEW_USER: string = "Create New User";
export const CREATE_USER_SUBTITLE: string = "Fill in the details to add a new team member";
export const NAME: string = "Name";
export const FULL_NAME: string = "Full Name";
export const EMAIL: string = "Email";
export const EMAIL_ADDRESS: string = "Email Address";
export const PASSWORD: string = "Password";
export const ROLE: string = "Role";
export const SELECT_ROLE: string = "Select Role";
export const ADMIN: string = "Admin";
export const SUPERADMIN: string = "Super Admin";
export const USER: string = "User";

// Common
export const SUBMIT: string = "Submit";
export const CANCEL: string = "Cancel";
export const SAVE_CHANGES: string = "Save Changes";
export const CREATING_USER: string = "Creating user...";
export const UPDATING_USER: string = "Updating user...";
export const CREATING_PROJECT: string = "Creating project...";
export const UPDATING_PROJECT: string = "Updating project...";

// Edit Project
export const EDIT_PROJECT: string = "Edit Project";
export const EDIT_PROJECT_SUBTITLE: string = "Update project information";
export const UPDATE_PROJECT: string = "Update Project";

// Edit User
export const EDIT_USER: string = "Edit User";
export const EDIT_USER_SUBTITLE: string = "Update user information";

// Project Form Labels
export const PROJECT_NAME: string = "Project Name";
export const DESCRIPTION: string = "Description";
export const STATUS: string = "Status";
export const PRIORITY: string = "Priority";
export const TECHNOLOGIES: string = "Technologies";
export const BUDGET: string = "Budget";
export const START_DATE: string = "Start Date";
export const END_DATE: string = "End Date";
export const TEAM_MEMBERS: string = "Team Members";
export const CREATE_PROJECT: string = "Create Project";
export const CREATE_NEW_PROJECT: string = "Create New Project";
export const CREATE_PROJECT_SUBTITLE: string = "Fill in the details to create a new project";

// Placeholders
export const ENTER_PROJECT_NAME: string = "Enter project name";
export const DESCRIBE_YOUR_PROJECT: string = "Describe your project...";
export const ENTER_BUDGET: string = "Enter budget";
export const ADD_TEAM_MEMBERS: string = "Add team members";
export const TECHNOLOGIES_PLACEHOLDER: string = "React, Node.js, MongoDB...";
export const ENTER_FULL_NAME: string = "Enter full name";
export const ENTER_EMAIL_ADDRESS: string = "Enter email address";
export const ENTER_PASSWORD: string = "Enter password";

// Status Options
export const SELECT_STATUS: string = "Select Status";
export const STATUS_PLANNING: string = "Planning";
export const STATUS_IN_PROGRESS: string = "In Progress";
export const STATUS_ON_HOLD: string = "On Hold";
export const STATUS_COMPLETED: string = "Completed";
export const STATUS_CANCELLED: string = "Cancelled";

// Priority Options
export const SELECT_PRIORITY: string = "Select Priority";
export const PRIORITY_LOW: string = "Low";
export const PRIORITY_MEDIUM: string = "Medium";
export const PRIORITY_HIGH: string = "High";

// Validation Error Messages - User Form
export const ERROR_FULL_NAME_REQUIRED: string = "Full name is required";
export const ERROR_NAME_MIN_LENGTH: string = "Name must be at least 2 characters";
export const ERROR_NAME_MAX_LENGTH: string = "Name must be less than 50 characters";
export const ERROR_EMAIL_REQUIRED: string = "Email is required";
export const ERROR_EMAIL_INVALID: string = "Please enter a valid email address";
export const ERROR_PASSWORD_REQUIRED: string = "Password is required";
export const ERROR_PASSWORD_MIN_LENGTH: string = "Password must be at least 8 characters";
export const ERROR_PASSWORD_UPPERCASE: string = "Password must contain at least one uppercase letter";
export const ERROR_PASSWORD_LOWERCASE: string = "Password must contain at least one lowercase letter";
export const ERROR_PASSWORD_NUMBER: string = "Password must contain at least one number";
export const ERROR_PASSWORD_SPECIAL: string = "Password must contain at least one special character";
export const ERROR_SELECT_ROLE: string = "Please select a role";

// Validation Error Messages - Project Form
export const ERROR_PROJECT_NAME_REQUIRED: string = "Project name is required";
export const ERROR_PROJECT_NAME_MIN_LENGTH: string = "Project name must be at least 3 characters";
export const ERROR_PROJECT_NAME_MAX_LENGTH: string = "Project name must be less than 100 characters";
export const ERROR_DESCRIPTION_MIN_LENGTH: string = "Description must be at least 10 characters";
export const ERROR_DESCRIPTION_MAX_LENGTH: string = "Description must be less than 500 characters";
export const ERROR_SELECT_STATUS: string = "Please select a status";
export const ERROR_SELECT_PRIORITY: string = "Please select a priority";
export const ERROR_BUDGET_NEGATIVE: string = "Budget cannot be negative";
export const ERROR_BUDGET_MAX_LIMIT: string = "Budget exceeds maximum limit";
export const ERROR_START_DATE_REQUIRED: string = "Start date is required";
export const ERROR_END_DATE_REQUIRED: string = "End date is required";
export const ERROR_END_DATE_AFTER_START: string = "End date must be after start date";
