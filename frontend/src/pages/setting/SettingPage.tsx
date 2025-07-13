import React, { useState } from 'react';
import {
  FiSettings,
  FiTable,
  FiMousePointer,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiSave,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiGrid,
  FiCode,
  FiToggleLeft,
  FiToggleRight,
  FiAlertCircle
} from 'react-icons/fi';

// Types (as provided)
export interface APIConfig {
  method: string;
  url: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  suffix?: string;
  refresh?: boolean;
}

export interface PageConfig {
  id: string;
  permission?: string;
  pageTitle: string;
  pageIcon: string;
  table: {
    initialSortBy: string;
    initialSortDirection: string;
    columns: {
      key: string;
      label: string;
      width?: number;
      sortable?: boolean;
      type?: 'text' | 'number' | 'date' | 'boolean';
      defaultValue?: any;
      isShow?: boolean;
    }[];
    api: APIConfig;
  };
  action: {
    mainButton: {
      permission?: string;
      key: string;
      label: string;
      isShow?: boolean;
      openForm?: string;
      api?: APIConfig;
    };
    tableButtons?: {
      permission?: string;
      key: string;
      label: string;
      icon?: string;
      isShow?: boolean;
      openForm?: string;
      api?: APIConfig;
    }[];
  };
  form: FormConfig[];
}

export interface FormConfig {
  key: string;
  name: string;
  initData?: boolean;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    options?: { value: string; label: string }[];
    defaultValue?: any;
    required?: boolean;
    disabled?: boolean;
  }[];
  api?: APIConfig;
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: 'white',
    padding: '24px 32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '300',
    color: '#1a202c',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    marginTop: '8px',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 32px 32px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a202c',
    backgroundColor: '#f7fafc',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a202c',
    backgroundColor: '#f7fafc',
    cursor: 'pointer',
    outline: 'none',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
  },
  dangerButton: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '16px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e2e8f0',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  codeBlock: {
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'Monaco, Consolas, monospace',
    overflow: 'auto',
    marginTop: '12px',
  },
  hint: {
    fontSize: '13px',
    color: '#718096',
    fontStyle: 'italic',
    marginTop: '4px',
  },
};

 const ConfigurationApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'page' | 'table' | 'button' | 'form'>('page');
  const [config, setConfig] = useState<PageConfig>({
    id: 'productManagement',
    pageTitle: 'Product Management',
    pageIcon: 'StorageIcon',
    table: {
      initialSortBy: 'name',
      initialSortDirection: 'asc',
      columns: [],
      api: {
        method: 'GET',
        url: '/api/product/search',
      },
    },
    action: {
      mainButton: {
        key: 'addProduct',
        label: 'Add Product',
        isShow: true,
      },
      tableButtons: [],
    },
    form: [],
  });

  const [showApiConfig, setShowApiConfig] = useState(false);
  const [currentApiConfig, setCurrentApiConfig] = useState<APIConfig | null>(null);

  const renderPageTab = () => (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        <FiSettings size={20} />
        Basic Page Configuration
      </h3>
      <div style={styles.grid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Page ID</label>
          <input
            style={styles.input}
            type="text"
            value={config.id}
            onChange={(e) => setConfig({ ...config, id: e.target.value })}
            placeholder="e.g., productManagement"
          />
          <span style={styles.hint}>Unique identifier for this page configuration</span>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Page Title</label>
          <input
            style={styles.input}
            type="text"
            value={config.pageTitle}
            onChange={(e) => setConfig({ ...config, pageTitle: e.target.value })}
            placeholder="e.g., Product Management"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Page Icon</label>
          <input
            style={styles.input}
            type="text"
            value={config.pageIcon}
            onChange={(e) => setConfig({ ...config, pageIcon: e.target.value })}
            placeholder="e.g., StorageIcon"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Permission (Optional)</label>
          <input
            style={styles.input}
            type="text"
            value={config.permission || ''}
            onChange={(e) => setConfig({ ...config, permission: e.target.value })}
            placeholder="e.g., admin.products.view"
          />
        </div>
      </div>
    </div>
  );

  const renderTableTab = () => (
    <>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          <FiTable size={20} />
          Table Configuration
        </h3>
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Initial Sort Column</label>
            <input
              style={styles.input}
              type="text"
              value={config.table.initialSortBy}
              onChange={(e) =>
                setConfig({
                  ...config,
                  table: { ...config.table, initialSortBy: e.target.value },
                })
              }
              placeholder="e.g., name"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Initial Sort Direction</label>
            <select
              style={styles.select}
              value={config.table.initialSortDirection}
              onChange={(e) =>
                setConfig({
                  ...config,
                  table: { ...config.table, initialSortDirection: e.target.value },
                })
              }
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <label style={styles.label}>Table API Configuration</label>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => {
              setCurrentApiConfig(config.table.api);
              setShowApiConfig(true);
            }}
          >
            <FiCode size={16} />
            Configure API
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          <FiGrid size={20} />
          Table Columns
        </h3>
        <button
          style={{ ...styles.button, ...styles.primaryButton, marginBottom: '16px' }}
          onClick={() => {
            const newColumn = {
              key: '',
              label: '',
              type: 'text' as const,
              sortable: true,
              isShow: true,
            };
            setConfig({
              ...config,
              table: {
                ...config.table,
                columns: [...config.table.columns, newColumn],
              },
            });
          }}
        >
          <FiPlus size={16} />
          Add Column
        </button>
        
        <ul style={styles.list}>
          {config.table.columns.map((column, index) => (
            <li key={index} style={styles.listItem}>
              <div style={{ flex: 1 }}>
                <div style={styles.grid}>
                  <input
                    style={{ ...styles.input, marginBottom: '8px' }}
                    type="text"
                    value={column.key}
                    onChange={(e) => {
                      const newColumns = [...config.table.columns];
                      newColumns[index].key = e.target.value;
                      setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                    }}
                    placeholder="Column key"
                  />
                  <input
                    style={{ ...styles.input, marginBottom: '8px' }}
                    type="text"
                    value={column.label}
                    onChange={(e) => {
                      const newColumns = [...config.table.columns];
                      newColumns[index].label = e.target.value;
                      setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                    }}
                    placeholder="Column label"
                  />
                  <select
                    style={{ ...styles.select, marginBottom: '8px' }}
                    value={column.type}
                    onChange={(e) => {
                      const newColumns = [...config.table.columns];
                      newColumns[index].type = e.target.value as any;
                      setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <input
                    style={{ ...styles.input, marginBottom: '8px' }}
                    type="number"
                    value={column.width || ''}
                    onChange={(e) => {
                      const newColumns = [...config.table.columns];
                      newColumns[index].width = parseInt(e.target.value);
                      setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                    }}
                    placeholder="Width %"
                  />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={column.sortable}
                      onChange={(e) => {
                        const newColumns = [...config.table.columns];
                        newColumns[index].sortable = e.target.checked;
                        setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                      }}
                    />
                    Sortable
                  </label>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={column.isShow}
                      onChange={(e) => {
                        const newColumns = [...config.table.columns];
                        newColumns[index].isShow = e.target.checked;
                        setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                      }}
                    />
                    Visible
                  </label>
                </div>
              </div>
              <button
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={() => {
                  const newColumns = config.table.columns.filter((_, i) => i !== index);
                  setConfig({ ...config, table: { ...config.table, columns: newColumns } });
                }}
              >
                <FiTrash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderButtonTab = () => (
    <>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          <FiMousePointer size={20} />
          Main Action Button
        </h3>
        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Button Key</label>
            <input
              style={styles.input}
              type="text"
              value={config.action.mainButton.key}
              onChange={(e) =>
                setConfig({
                  ...config,
                  action: {
                    ...config.action,
                    mainButton: { ...config.action.mainButton, key: e.target.value },
                  },
                })
              }
              placeholder="e.g., addProduct"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Button Label</label>
            <input
              style={styles.input}
              type="text"
              value={config.action.mainButton.label}
              onChange={(e) =>
                setConfig({
                  ...config,
                  action: {
                    ...config.action,
                    mainButton: { ...config.action.mainButton, label: e.target.value },
                  },
                })
              }
              placeholder="e.g., Add Product"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Action Type</label>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <label style={styles.toggle}>
              <input
                type="radio"
                name="mainActionType"
                checked={!!config.action.mainButton.openForm}
                onChange={() =>
                  setConfig({
                    ...config,
                    action: {
                      ...config.action,
                      mainButton: {
                        ...config.action.mainButton,
                        openForm: 'formKey',
                        api: undefined,
                      },
                    },
                  })
                }
              />
              <span style={{ marginLeft: '8px' }}>Open Form</span>
            </label>
            <label style={styles.toggle}>
              <input
                type="radio"
                name="mainActionType"
                checked={!!config.action.mainButton.api && !config.action.mainButton.openForm}
                onChange={() =>
                  setConfig({
                    ...config,
                    action: {
                      ...config.action,
                      mainButton: {
                        ...config.action.mainButton,
                        openForm: undefined,
                        api: { method: 'POST', url: '/api/resource' },
                      },
                    },
                  })
                }
              />
              <span style={{ marginLeft: '8px' }}>Call API</span>
            </label>
          </div>
        </div>

        {config.action.mainButton.openForm && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Form Key</label>
            <input
              style={styles.input}
              type="text"
              value={config.action.mainButton.openForm}
              onChange={(e) =>
                setConfig({
                  ...config,
                  action: {
                    ...config.action,
                    mainButton: { ...config.action.mainButton, openForm: e.target.value },
                  },
                })
              }
              placeholder="e.g., addProductForm"
            />
          </div>
        )}

        {config.action.mainButton.api && !config.action.mainButton.openForm && (
          <button
            style={{ ...styles.button, ...styles.secondaryButton, marginTop: '12px' }}
            onClick={() => {
              setCurrentApiConfig(config.action.mainButton.api!);
              setShowApiConfig(true);
            }}
          >
            <FiCode size={16} />
            Configure API
          </button>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          <FiEdit size={20} />
          Table Row Actions
        </h3>
        <button
          style={{ ...styles.button, ...styles.primaryButton, marginBottom: '16px' }}
          onClick={() => {
            const newButton = {
              key: '',
              label: '',
              icon: '',
              isShow: true,
            };
            setConfig({
              ...config,
              action: {
                ...config.action,
                tableButtons: [...(config.action.tableButtons || []), newButton],
              },
            });
          }}
        >
          <FiPlus size={16} />
          Add Table Button
        </button>

        <ul style={styles.list}>
          {config.action.tableButtons?.map((button, index) => (
            <li key={index} style={styles.listItem}>
              <div style={{ flex: 1 }}>
                <div style={styles.grid}>
                  <input
                    style={{ ...styles.input, marginBottom: '8px' }}
                    type="text"
                    value={button.key}
                    onChange={(e) => {
                      const newButtons = [...(config.action.tableButtons || [])];
                      newButtons[index].key = e.target.value;
                      setConfig({ ...config, action: { ...config.action, tableButtons: newButtons } });
                    }}
                    placeholder="Button key"
                  />
                  <input
                    style={{ ...styles.input, marginBottom: '8px' }}
                    type="text"
                    value={button.label}
                    onChange={(e) => {
                      const newButtons = [...(config.action.tableButtons || [])];
                      newButtons[index].label = e.target.value;
                      setConfig({ ...config, action: { ...config.action, tableButtons: newButtons } });
                    }}
                    placeholder="Button label"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Action Type</label>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <label style={styles.toggle}>
                      <input
                        type="radio"
                        name={`tableActionType${index}`}
                        checked={!!button.openForm}
                        onChange={() => {
                          const newButtons = [...(config.action.tableButtons || [])];
                          newButtons[index] = {
                            ...newButtons[index],
                            openForm: 'formKey',
                            api: undefined,
                          };
                          setConfig({ ...config, action: { ...config.action, tableButtons: newButtons } });
                        }}
                      />
                      <span style={{ marginLeft: '8px' }}>Open Form</span>
                    </label>
                    <label style={styles.toggle}>
                      <input
                        type="radio"
                        name={`tableActionType${index}`}
                        checked={!!button.api && !button.openForm}
                        onChange={() => {
                          const newButtons = [...(config.action.tableButtons || [])];
                          newButtons[index] = {
                            ...newButtons[index],
                            openForm: undefined,
                            api: { method: 'DELETE', url: '/api/resource' },
                          };
                          setConfig({ ...config, action: { ...config.action, tableButtons: newButtons } });
                        }}
                      />
                      <span style={{ marginLeft: '8px' }}>Call API</span>
                    </label>
                  </div>
                </div>

                {button.openForm && (
                  <input
                    style={{ ...styles.input, marginTop: '8px' }}
                    type="text"
                    value={button.openForm}
                    onChange={(e) => {
                      const newButtons = [...(config.action.tableButtons || [])];
                      newButtons[index].openForm = e.target.value;
                      setConfig({ ...config, action: { ...config.action, tableButtons: newButtons } });
                    }}
                    placeholder="Form key"
                  />
                )}

                {button.api && !button.openForm && (
                  <button
                    style={{ ...styles.button, ...styles.secondaryButton, marginTop: '8px' }}
                    onClick={() => {
                      setCurrentApiConfig(button.api!);
                      setShowApiConfig(true);
                    }}
                  >
                    <FiCode size={16} />
                    Configure API
                  </button>
                )}
              </div>
              <button
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={() => {
                  const newButtons = config.action.tableButtons?.filter((_, i) => i !== index) || [];
                  setConfig({ ...config, action: { ...config.action, tableButtons: newButtons } });
                }}
              >
                <FiTrash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const renderFormTab = () => (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        <FiFileText size={20} />
        Forms Configuration
      </h3>
      <button
        style={{ ...styles.button, ...styles.primaryButton, marginBottom: '16px' }}
        onClick={() => {
          const newForm: FormConfig = {
            key: '',
            name: '',
            fields: [],
          };
          setConfig({ ...config, form: [...config.form, newForm] });
        }}
      >
        <FiPlus size={16} />
        Add Form
      </button>

      {config.form.map((form, formIndex) => (
        <div key={formIndex} style={{ ...styles.listItem, marginBottom: '24px', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, color: '#2d3748' }}>Form {formIndex + 1}</h4>
            <button
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={() => {
                const newForms = config.form.filter((_, i) => i !== formIndex);
                setConfig({ ...config, form: newForms });
              }}
            >
              <FiTrash2 size={16} />
              Remove Form
            </button>
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Form Key</label>
              <input
                style={styles.input}
                type="text"
                value={form.key}
                onChange={(e) => {
                  const newForms = [...config.form];
                  newForms[formIndex].key = e.target.value;
                  setConfig({ ...config, form: newForms });
                }}
                placeholder="e.g., addProductForm"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Form Name</label>
              <input
                style={styles.input}
                type="text"
                value={form.name}
                onChange={(e) => {
                  const newForms = [...config.form];
                  newForms[formIndex].name = e.target.value;
                  setConfig({ ...config, form: newForms });
                }}
                placeholder="e.g., Add Product"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={form.initData || false}
                onChange={(e) => {
                  const newForms = [...config.form];
                  newForms[formIndex].initData = e.target.checked;
                  setConfig({ ...config, form: newForms });
                }}
              />
              Initialize with existing data (for edit forms)
            </label>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={styles.label}>Form API Configuration</label>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => {
                setCurrentApiConfig(form.api || { method: 'POST', url: '/api/resource' });
                setShowApiConfig(true);
              }}
            >
              <FiCode size={16} />
              Configure API
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={styles.label}>Form Fields</label>
            <button
              style={{ ...styles.button, ...styles.primaryButton, marginBottom: '12px' }}
              onClick={() => {
                const newForms = [...config.form];
                newForms[formIndex].fields.push({
                  key: '',
                  label: '',
                  type: 'text',
                  required: false,
                  disabled: false,
                });
                setConfig({ ...config, form: newForms });
              }}
            >
              <FiPlus size={16} />
              Add Field
            </button>

            {form.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} style={{ ...styles.listItem, marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={styles.grid}>
                    <input
                      style={{ ...styles.input, marginBottom: '8px' }}
                      type="text"
                      value={field.key}
                      onChange={(e) => {
                        const newForms = [...config.form];
                        newForms[formIndex].fields[fieldIndex].key = e.target.value;
                        setConfig({ ...config, form: newForms });
                      }}
                      placeholder="Field key"
                    />
                    <input
                      style={{ ...styles.input, marginBottom: '8px' }}
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const newForms = [...config.form];
                        newForms[formIndex].fields[fieldIndex].label = e.target.value;
                        setConfig({ ...config, form: newForms });
                      }}
                      placeholder="Field label"
                    />
                    <select
                      style={{ ...styles.select, marginBottom: '8px' }}
                      value={field.type}
                      onChange={(e) => {
                        const newForms = [...config.form];
                        newForms[formIndex].fields[fieldIndex].type = e.target.value as any;
                        setConfig({ ...config, form: newForms });
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Boolean</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={field.required || false}
                        onChange={(e) => {
                          const newForms = [...config.form];
                          newForms[formIndex].fields[fieldIndex].required = e.target.checked;
                          setConfig({ ...config, form: newForms });
                        }}
                      />
                      Required
                    </label>
                    <label style={styles.toggle}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={field.disabled || false}
                        onChange={(e) => {
                          const newForms = [...config.form];
                          newForms[formIndex].fields[fieldIndex].disabled = e.target.checked;
                          setConfig({ ...config, form: newForms });
                        }}
                      />
                      Disabled
                    </label>
                  </div>
                </div>
                <button
                  style={{ ...styles.button, ...styles.dangerButton }}
                  onClick={() => {
                    const newForms = [...config.form];
                    newForms[formIndex].fields = newForms[formIndex].fields.filter((_, i) => i !== fieldIndex);
                    setConfig({ ...config, form: newForms });
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const APIConfigModal = () => {
    if (!showApiConfig || !currentApiConfig) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div style={{ ...styles.card, maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ ...styles.cardTitle, margin: 0 }}>
              <FiCode size={20} />
              API Configuration
            </h3>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => {
                setShowApiConfig(false);
                setCurrentApiConfig(null);
              }}
            >
              <FiX size={16} />
              Close
            </button>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>HTTP Method</label>
            <select
              style={styles.select}
              value={currentApiConfig.method}
              onChange={(e) => setCurrentApiConfig({ ...currentApiConfig, method: e.target.value })}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>URL</label>
            <input
              style={styles.input}
              type="text"
              value={currentApiConfig.url}
              onChange={(e) => setCurrentApiConfig({ ...currentApiConfig, url: e.target.value })}
              placeholder="/api/resource"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>URL Suffix (Optional)</label>
            <input
              style={styles.input}
              type="text"
              value={currentApiConfig.suffix || ''}
              onChange={(e) => setCurrentApiConfig({ ...currentApiConfig, suffix: e.target.value })}
              placeholder="e.g., :id"
            />
            <span style={styles.hint}>Used for dynamic URL parts like /api/product/:id</span>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.toggle}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={currentApiConfig.refresh || false}
                onChange={(e) => setCurrentApiConfig({ ...currentApiConfig, refresh: e.target.checked })}
              />
              Refresh table after API call
            </label>
          </div>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => {
              // Save API config logic here
              setShowApiConfig(false);
              setCurrentApiConfig(null);
            }}
          >
            <FiSave size={16} />
            Save Configuration
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          <FiSettings size={32} color="#3b82f6" />
          Dynamic Page Configuration
        </h1>
        <p style={styles.subtitle}>
          Configure your dynamic page with tables, forms, and actions
        </p>
      </header>

      <div style={styles.content}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'page' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('page')}
          >
            <FiSettings size={18} />
            Page
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'table' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('table')}
          >
            <FiTable size={18} />
            Table
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'button' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('button')}
          >
            <FiMousePointer size={18} />
            Actions
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'form' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('form')}
          >
            <FiFileText size={18} />
            Forms
          </button>
        </div>

        {activeTab === 'page' && renderPageTab()}
        {activeTab === 'table' && renderTableTab()}
        {activeTab === 'button' && renderButtonTab()}
        {activeTab === 'form' && renderFormTab()}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <FiCode size={20} />
            Generated Configuration
          </h3>
          <p style={styles.hint}>
            Copy this configuration to use in your dynamic page component
          </p>
          <pre style={styles.codeBlock}>
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>

      <APIConfigModal />
    </div>
  );
};

export default ConfigurationApp;