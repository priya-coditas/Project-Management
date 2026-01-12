import { useState, useEffect } from 'react';
import './CreateProject.css'
import { MdClose, MdFolder, MdDescription, MdFlag, MdCode, MdCurrencyRupee, MdDateRange, MdGroup, MdCheck } from 'react-icons/md';
import { 
  PROJECT_NAME, 
  DESCRIPTION, 
  STATUS, 
  PRIORITY, 
  TECHNOLOGIES, 
  BUDGET, 
  TEAM_MEMBERS, 
  START_DATE, 
  END_DATE, 
  CREATE_PROJECT, 
  CANCEL,
  CREATE_NEW_PROJECT,
  CREATE_PROJECT_SUBTITLE,
  CREATING_PROJECT,
  ENTER_PROJECT_NAME,
  DESCRIBE_YOUR_PROJECT,
  ENTER_BUDGET,
  ADD_TEAM_MEMBERS,
  TECHNOLOGIES_PLACEHOLDER,
  SELECT_STATUS,
  STATUS_PLANNING,
  STATUS_CANCELLED,
  STATUS_IN_PROGRESS,
  STATUS_ON_HOLD,
  STATUS_COMPLETED,
  SELECT_PRIORITY,
  PRIORITY_LOW,
  PRIORITY_MEDIUM,
  PRIORITY_HIGH,
  ERROR_PROJECT_NAME_REQUIRED,
  ERROR_PROJECT_NAME_MIN_LENGTH,
  ERROR_PROJECT_NAME_MAX_LENGTH,
  ERROR_DESCRIPTION_MIN_LENGTH,
  ERROR_DESCRIPTION_MAX_LENGTH,
  ERROR_SELECT_STATUS,
  ERROR_SELECT_PRIORITY,
  ERROR_BUDGET_NEGATIVE,
  ERROR_BUDGET_MAX_LIMIT,
  ERROR_START_DATE_REQUIRED,
  ERROR_END_DATE_REQUIRED,
  ERROR_END_DATE_AFTER_START
} from '../../Constants/string';
import api from '../../api/axios';
import { Loading } from '../Loading/Shimmer';

interface User {
  id: string | number;
  _id?: string;
  name: string;
  email: string;
  role: string;
}

interface CreateProjectFormData {
  name: string;
  description: string;
  status: string;
  priority: string;
  technologies: string;
  budget: string;
  startDate: string;
  endDate: string;
  teamMembers: string[];
}

interface FormErrors {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  technologies?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  teamMembers?: string;
}

interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

function CreateProject({ isOpen, onClose, onProjectCreated }: CreateProjectProps) {
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: "",
    description: "",
    status: "",
    priority: "",
    technologies: "",
    budget: "",
    startDate: "",
    endDate: "",
    teamMembers: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Fetch users for team member selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const responseData = response.data;
        
        let userData: User[] = [];
        if (Array.isArray(responseData)) {
          userData = responseData;
        } else if (responseData?.users) {
          userData = responseData.users;
        } else if (responseData?.data) {
          userData = responseData.data;
        }
        setUsers(userData);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleUserSelection = (userId: string) => {
    setFormData(prev => {
      const isSelected = prev.teamMembers.includes(userId);
      if (isSelected) {
        return { ...prev, teamMembers: prev.teamMembers.filter(id => id !== userId) };
      } else {
        return { ...prev, teamMembers: [...prev.teamMembers, userId] };
      }
    });
  };

  const getSelectedUserNames = () => {
    return formData.teamMembers
      .map(id => users.find(u => (u.id?.toString() || u._id) === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const validateField = (name: string, value: string | number): string => {
    const strValue = String(value);
    
    switch (name) {
      case 'name':
        if (!strValue.trim()) return ERROR_PROJECT_NAME_REQUIRED;
        if (strValue.trim().length < 3) return ERROR_PROJECT_NAME_MIN_LENGTH;
        if (strValue.trim().length > 100) return ERROR_PROJECT_NAME_MAX_LENGTH;
        return '';
      case 'description':
        if (strValue.trim() && strValue.trim().length < 10) return ERROR_DESCRIPTION_MIN_LENGTH;
        if (strValue.trim().length > 500) return ERROR_DESCRIPTION_MAX_LENGTH;
        return '';
      case 'status':
        if (!strValue) return ERROR_SELECT_STATUS;
        return '';
      case 'priority':
        if (!strValue) return ERROR_SELECT_PRIORITY;
        return '';
      case 'budget':
        if (strValue && Number(strValue) < 0) return ERROR_BUDGET_NEGATIVE;
        if (strValue && Number(strValue) > 999999999) return ERROR_BUDGET_MAX_LIMIT;
        return '';
      case 'startDate':
        if (!strValue) return ERROR_START_DATE_REQUIRED;
        return '';
      case 'endDate':
        if (!strValue) return ERROR_END_DATE_REQUIRED;
        if (formData.startDate && strValue < formData.startDate) {
          return ERROR_END_DATE_AFTER_START;
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError('');
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // Special case: validate end date when start date changes
    if (name === 'startDate' && touched.endDate && formData.endDate) {
      const endDateError = formData.endDate < value ? ERROR_END_DATE_AFTER_START : '';
      setErrors((prev) => ({ ...prev, endDate: endDateError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField('name', formData.name),
      description: validateField('description', formData.description),
      status: validateField('status', formData.status),
      priority: validateField('priority', formData.priority),
      budget: validateField('budget', formData.budget),
      technologies: validateField('technologies', formData.technologies),
      startDate: validateField('startDate', formData.startDate),
      endDate: validateField('endDate', formData.endDate),
    };
    
    setErrors(newErrors);
    setTouched({
      name: true,
      description: true,
      status: true,
      priority: true,
      budget: true,
      startDate: true,
      endDate: true,
    });
    
    return !Object.values(newErrors).some(error => error);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "",
      priority: "",
      technologies: "",
      budget: "",
      startDate: "",
      endDate: "",
      teamMembers: []
    });
    setErrors({});
    setTouched({});
    setApiError('');
    setShowUserDropdown(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setApiError('');
      
      try {
        // Convert technologies string to array and budget to number for API
        const submitData = {
          ...formData,
          technologies: formData.technologies
            ? formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
            : [],
          budget: formData.budget ? Number(formData.budget) : 0,
          teamMembers: formData.teamMembers
        };
        await api.post('/projects', submitData);
        resetForm();
        onProjectCreated?.();
        onClose();
      } catch (err: any) {
        const errorMessage = err.response?.data?.message;
        if (Array.isArray(errorMessage)) {
          setApiError(errorMessage.join(', '));
        } else if (typeof errorMessage === 'string') {
          setApiError(errorMessage);
        } else {
          setApiError('Failed to create project. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    resetForm();
    onClose();
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && <Loading variant="overlay" text={CREATING_PROJECT} />}
      
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-title">
              <div className="modal-icon">
                <MdFolder size={24} />
              </div>
              <div>
                <h2>{CREATE_NEW_PROJECT}</h2>
                <p>{CREATE_PROJECT_SUBTITLE}</p>
              </div>
            </div>
            <button className="modal-close" onClick={handleClose} disabled={loading}>
              <MdClose size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={onSubmit} className="modal-form" noValidate>
            {/* API Error Message */}
            {apiError && (
              <div className="api-error-message">
                {apiError}
              </div>
            )}

            <div className="form-grid">
              {/* Project Name */}
              <div className="form-group full-width">
                <label className="form-label">
                  <MdFolder size={16} />
                  {PROJECT_NAME}
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
                  placeholder={ENTER_PROJECT_NAME}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {errors.name && touched.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label className="form-label">
                  <MdDescription size={16} />
                  {DESCRIPTION}
                </label>
                <textarea
                  name="description"
                  className={`form-textarea ${errors.description && touched.description ? 'input-error' : ''}`}
                  placeholder={DESCRIBE_YOUR_PROJECT}
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  disabled={loading}
                />
                {errors.description && touched.description && (
                  <span className="error-message">{errors.description}</span>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">
                  <MdFlag size={16} />
                  {STATUS}
                </label>
                <select
                  name="status"
                  className={`form-select ${errors.status && touched.status ? 'input-error' : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                >
                  <option value="">{SELECT_STATUS}</option>
                  <option value="planning">{STATUS_PLANNING}</option>
                  <option value="in_progress">{STATUS_IN_PROGRESS}</option>
                  <option value="on_hold">{STATUS_ON_HOLD}</option>
                  <option value="completed">{STATUS_COMPLETED}</option>
                  <option value="cancelled">{STATUS_CANCELLED}</option>
                </select>
                {errors.status && touched.status && (
                  <span className="error-message">{errors.status}</span>
                )}
              </div>

              {/* Priority */}
              <div className="form-group">
                <label className="form-label">
                  <MdFlag size={16} />
                  {PRIORITY}
                </label>
                <select
                  name="priority"
                  className={`form-select ${errors.priority && touched.priority ? 'input-error' : ''}`}
                  value={formData.priority}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                >
                  <option value="">{SELECT_PRIORITY}</option>
                  <option value="low">{PRIORITY_LOW}</option>
                  <option value="medium">{PRIORITY_MEDIUM}</option>
                  <option value="high">{PRIORITY_HIGH}</option>
                </select>
                {errors.priority && touched.priority && (
                  <span className="error-message">{errors.priority}</span>
                )}
              </div>

              {/* Technologies */}
              <div className="form-group full-width">
                <label className="form-label">
                  <MdCode size={16} />
                  {TECHNOLOGIES}
                </label>
                <input
                  type="text"
                  name="technologies"
                  className="form-input"
                  placeholder={TECHNOLOGIES_PLACEHOLDER}
                  value={formData.technologies}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Budget */}
              <div className="form-group">
                <label className="form-label">
                  <MdCurrencyRupee size={16} />
                  {BUDGET}
                </label>
                <input
                  type="number"
                  name="budget"
                  className={`form-input ${errors.budget && touched.budget ? 'input-error' : ''}`}
                  placeholder={ENTER_BUDGET}
                  value={formData.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  disabled={loading}
                />
                {errors.budget && touched.budget && (
                  <span className="error-message">{errors.budget}</span>
                )}
              </div>

              {/* Team Members Multi-Select */}
              <div className="form-group full-width">
                <label className="form-label">
                  <MdGroup size={16} />
                  {TEAM_MEMBERS}
                </label>
                <div className="multi-select-container">
                  <div 
                    className="multi-select-input"
                    onClick={() => !loading && setShowUserDropdown(!showUserDropdown)}
                  >
                    <span className={formData.teamMembers.length > 0 ? 'selected-text' : 'placeholder-text'}>
                      {formData.teamMembers.length > 0 
                        ? getSelectedUserNames() || `${formData.teamMembers.length} members selected`
                        : ADD_TEAM_MEMBERS}
                    </span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {showUserDropdown && (
                    <div className="multi-select-dropdown">
                      {users.length === 0 ? (
                        <div className="dropdown-item no-users">No users available</div>
                      ) : (
                        users.map(user => {
                          const userId = user.id?.toString() || user._id || '';
                          const isSelected = formData.teamMembers.includes(userId);
                          return (
                            <div 
                              key={userId}
                              className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleUserSelection(userId)}
                            >
                              <div className="checkbox-wrapper">
                                {isSelected && <MdCheck size={16} />}
                              </div>
                              <div className="user-info-dropdown">
                                <span className="user-name-dropdown">{user.name}</span>
                                <span className="user-email-dropdown">{user.email}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label">
                  <MdDateRange size={16} />
                  {START_DATE}
                </label>
                <input
                  type="date"
                  name="startDate"
                  className={`form-input ${errors.startDate && touched.startDate ? 'input-error' : ''}`}
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {errors.startDate && touched.startDate && (
                  <span className="error-message">{errors.startDate}</span>
                )}
              </div>

              {/* End Date */}
              <div className="form-group">
                <label className="form-label">
                  <MdDateRange size={16} />
                  {END_DATE}
                </label>
                <input
                  type="date"
                  name="endDate"
                  className={`form-input ${errors.endDate && touched.endDate ? 'input-error' : ''}`}
                  value={formData.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {errors.endDate && touched.endDate && (
                  <span className="error-message">{errors.endDate}</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={handleClose}
                disabled={loading}
              >
                {CANCEL}
              </button>
              <button 
                type="submit" 
                className="btn-create"
                disabled={loading}
              >
                {CREATE_PROJECT}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateProject;
