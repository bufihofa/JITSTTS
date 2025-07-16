import { IoSettingsSharp } from "react-icons/io5";
import Button from "../../component/common/Button";
import CMSInput from "../../component/common/Input";
import { MdDelete } from "react-icons/md";
import type { TableColumn } from "../../types/PageConfig";
import { searchData } from "../manage/DynamicTable";


interface TabTableProps {
    pageTitle: string;
    tableSortBy: string;
    setTableSortBy: (sortBy: string) => void;
    tableSortDirection: string;
    setTableSortDirection: (direction: string) => void;
    tableUrl: string;
    setTableUrl: (url: string) => void;
    tableMethod: string;
    setTableMethod: (method: string) => void;
    tableColumns: TableColumn[];
    setTableColumns: (columns: TableColumn[]) => void;
    saveChangesTable: () => void;
    saveChangesColumns: () => void;
}
const TabTable: React.FC<TabTableProps> = 
({
    pageTitle,
    tableSortBy,
    setTableSortBy,
    tableSortDirection,
    setTableSortDirection,
    tableUrl,
    setTableUrl,
    tableMethod,
    setTableMethod,
    tableColumns,
    setTableColumns,
    saveChangesTable,
    saveChangesColumns
}) => {
    // PAGE TAB
    const testButton = async () => {
        console.log("Test button clicked");

        const params: any = {};

        params.page = 1;
        params.limit = 10;
        params.searchTerm = '';
        params.sortBy = tableSortBy;
        params.sortDirection = tableSortDirection;

        try {
            const response = await searchData(
                tableMethod || 'GET',
                tableUrl || '/api/product/search',
                params
            );
            console.log(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const renderTableConfig = () => {
        return (
        <div className="table-tab-container">
          <div className="role-item table-config">
            <div className="role-header">
              <div className="role-header-container">
                <IoSettingsSharp className="role-icon" />
                <p className="role-title">Config Table - {pageTitle}</p>
                <div className="role-header-button">
                  <Button 
                    onAddButton={saveChangesTable}
                    text="Save Table"
                  />
                </div>
              </div>
              
            </div>
            <div className="role-content config-table">
                <div className="config-table-sort">
                    <div className="config-table-sort-column">
                        <CMSInput
                            label="Initial Sort Column"
                            value={tableSortBy}
                            onChange={setTableSortBy}
                            placeholder="id, name, etc..."
                        />
                    </div>
                    <div className="config-table-sort-direction">
                        
                        <input
                            type="radio"
                            name="sortDirection"
                            value="asc"
                            checked={tableSortDirection === 'asc'}
                            onChange={(e) => setTableSortDirection(e.target.value)}
                        />
                        ASC
                        
                        <input
                            type="radio"
                            name="sortDirection"
                            value="desc"
                            checked={tableSortDirection === 'desc'}
                            onChange={(e) => setTableSortDirection(e.target.value)}
                        />
                        DESC
                    </div>
                </div>
                <div className="config-table-sort">
                    <div className="config-table-sort-column">
                        <CMSInput
                            label="API URL"
                            value={tableUrl}
                            onChange={setTableUrl}
                            placeholder="/api/product/search"
                        />
                    </div>
                    <div className="config-table-sort-direction">
                        <select 
                            value={tableMethod}
                            onChange={(e) => {setTableMethod(e.target.value)}}
                        >
                            <option value={"GET"}>GET</option>
                            <option value={"POST"}>POST</option>
                            <option value={"PUT"}>PUT</option>
                            <option value={"PATCH"}>PATCH</option>
                            <option value={"DELETE"}>DELETE</option>
                            
                            </select>
                    </div>
                </div>
                <button 
                    className="test-button"
                    onClick={testButton}
                >
                    Test API
                </button>
            </div>
            
            
          </div>
          <div className="role-item table-config">
            <div className="role-header ">
              <div className="role-header-container">
                <IoSettingsSharp className="role-icon" />
                <p className="role-title">Config Table Columns</p>
                <div className="role-header-button">
                  <Button 
                    onAddButton={saveChangesColumns}
                    text="Save Column"
                  />
                </div>
              </div>
              
            </div>
            <div className="role-content config-table">

                {tableColumns.map((column, index) => (
                    <>
                    
                    <div key={index} className="config-table-column">
                        
                        <div className="config-table-delete-column">
                            
                            <button 
                                className="config-table-delete-button"
                                onClick={() => {
                                    const newColumns = tableColumns.filter((_, i) => i !== index);
                                    setTableColumns(newColumns);
                                }}
                            >
                                <MdDelete />
                            </button>
                            <p className="column-title">Column - {column.label}</p>  
                            
                        </div>
                        <div className="config-form-init">
                            <input
                                type="checkbox"
                                checked={column.sortable}
                                onChange={(e) => {
                                    const newColumns = [...tableColumns];
                                    newColumns[index].sortable = e.target.checked;
                                    setTableColumns(newColumns);
                                }}
                                
                            /> 
                            Sortable
                        </div>
                        <div className="config-table-input-column">
                            <CMSInput
                                label={`Key`}
                                value={column.key}
                                onChange={(value) => {
                                    const newColumns = [...tableColumns];
                                    newColumns[index].key = value;
                                    setTableColumns(newColumns);
                                }}
                                placeholder="Column key"
                            />
                            <CMSInput
                                label={`Label`}
                                value={column.label}
                                onChange={(value) => {
                                    const newColumns = [...tableColumns];
                                    newColumns[index].label = value;
                                    setTableColumns(newColumns);
                                }}
                                placeholder="Column label"
                            />
                        </div>
                        <div className="config-table-input-column">
                            <CMSInput
                                label={`Width`}
                                value={column.width?.toString() || ''}
                                onChange={(value) => {
                                    const newColumns = [...tableColumns];
                                    newColumns[index].width = parseInt(value, 10);
                                    setTableColumns(newColumns);
                                }}
                                placeholder="Column width"
                            />
                            <CMSInput
                                label={`Type`}
                                value={column.type || 'text'}
                                onChange={(value) => {
                                    const newColumns = [...tableColumns];
                                    newColumns[index].type = value as 'text' | 'number' | 'date' | 'boolean';
                                    setTableColumns(newColumns);
                                }}
                                placeholder="Column type"
                            />
                        </div>
                        
                    </div>
                    </>
                ))}
                <div className="config-table-add-column">
                    <Button 
                        onAddButton={() => {
                            setTableColumns([...tableColumns, { key: '', label: '', width: 0, type: 'text', isShow: true }]);
                        }}
                        text="Add Column"
                    />
                </div>
            </div>
          </div>
        </div>
        );
    }

    return (
        <div>
            {renderTableConfig()}
        </div>
    );
}

export default TabTable;