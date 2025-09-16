import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import type { ButtonConfig, FormConfig, PageConfig } from "../../types/PageConfig";
import { LuArrowDownZA, LuArrowUpAZ, LuArrowUpDown } from "react-icons/lu";
import { MdDelete, MdEdit, MdAdd, MdCopyAll, MdCall, MdCheckBoxOutlineBlank   } from "react-icons/md";

import './DynamicTable.css';

import Pagination from "../../component/pagination/Pagination";
import { DynamicAPI } from "./DynamicAPI";
import { useSetting } from "../../context/useSetting";
interface DynamicTableProps {
    pageConfig: PageConfig;
    searchQuery?: string;
    setFormConfig?: (formConfig: FormConfig) => void;
    setFormOpen?: (isOpen: boolean) => void;
    setInitData?: (data: any) => void;
    refreshKey?: number;
}

export const searchData = async (
    method: string,
    url: string,
    params?: {
        page?: number;
        limit?: number;
        searchTerm?: string;
        sortBy?: string;
        sortDirection?: string;
    }) =>
{
    try {
        console.log(method);
        const response = await axiosInstance.get(url, {
            params
        });

        return response.data;
    }
    catch (error: any) {
        console.error("Error fetching products:", error);
        return { res: [], pagination: { page: 1, totalPages: 1, totalItems: 0 } };
    }
}

const DynamicTable: React.FC<DynamicTableProps> = ({pageConfig, searchQuery, setFormConfig, setFormOpen, setInitData, refreshKey}) => {

    const [dataList, setDataList] = useState<any[]>([]);

    const [sortBy, setSortBy] = useState<string>(pageConfig.table.initialSortBy);
    const [sortDirection, setSortDirection] = useState(pageConfig.table.initialSortDirection);

    const {checkPerm} = useSetting();
    const shouldFetch = useRef(true);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
        hasMore: false,
        hasPrevious: false,
      });

    const config = pageConfig.table.columns;
    const buttons = pageConfig.action.tableButtons || [];
    const forms = pageConfig.form || [];

    const fetchTableData = async (page: number) => {
        setPagination(prev => ({
            ...prev,
            page: page,
            }));
        const params: any = {};

        params.page = page;
        params.limit = pagination.limit || 10;
        params.searchTerm = searchQuery || '';
        params.sortBy = sortBy;
        params.sortDirection = sortDirection;

        const api = pageConfig.table.api;
        try {
            const response = await searchData(
                api?.method || 'GET',
                api?.url || '/api/product/search',
                params
            );
            console.log(response);

            setDataList(response.data);

            if(response.pagination.totalPages < pagination.page) {
                setPagination(prev => ({
                ...prev,
                page: response.pagination.page,
                totalItems: response.pagination.totalItems,
                totalPages: response.pagination.totalPages,
            }));
            }
            else{
            setPagination(prev => ({
                ...prev,
                totalItems: response.pagination.totalItems,
                totalPages: response.pagination.totalPages,
            }));
            }

        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            shouldFetch.current = true;
        }

    };

    useEffect(() => {
        shouldFetch.current = false;
        setPagination(prev => ({
            ...prev,
            page: 1,
        }));
        fetchTableData(1);

    }, [searchQuery, sortBy, sortDirection, pagination.limit]);
    useEffect(() => {
        if (refreshKey !== undefined) {
            shouldFetch.current = false;
            fetchTableData(1);
        }
    }, [refreshKey]);
    const gotoPage = (page: number) =>{
        if(!shouldFetch.current) {
            console.log("Fetching is in progress, please wait.");
            return;
        }
        shouldFetch.current = false;
        fetchTableData(page);
    }

    const handleSort = (by: string) => {
        if (sortBy === by) {
        if(sortDirection == 'asc'){
            setSortDirection('desc');
        }
        else {
            setSortDirection('asc');
        }
        } else {
        setSortBy(by);
        setSortDirection('asc');
        }
    }

    const dynamicTH = (by: string, label: string, col: any, sortable?: boolean) => {
        if(!sortable) {
            return <th>{label}</th>;
        }
        return <th style={col.width ? { width: `${col.width}%` } : undefined} onClick={()=>{handleSort(by)}}>{label} {sortBy==by ? (sortDirection=="asc" ? <LuArrowUpAZ className="arrow"/> : <LuArrowDownZA className="arrow"/>) : <LuArrowUpDown className="arrow-unsort"/>}</th>

    }

    const getCellValue = (row: Record<string, any>, key: string) => {
        if (!key) {
            return undefined;
        }

        return key.split('.').reduce<any>((acc, part) => {
            if (acc === undefined || acc === null) {
                return undefined;
            }

            return acc[part];
        }, row);
    }

    const dynamicTD = (data: any, key: string) => {
        const value = getCellValue(data, key);

        let displayValue: ReactNode = value;
        if (value === undefined || value === null || value === '') {
            displayValue = 'N/A';
        } else if (typeof value === 'boolean') {
            displayValue = value ? 'True' : 'False';
        }

        return <td>{displayValue}</td>;

    }

    const paginationControls = useMemo(() => {
        return(
            <Pagination
                pagination={pagination}
                gotoPage={gotoPage}
            />
        )
    }, [pagination, dataList]);


    const renderButton = (button: string) => {
        if (button === 'del') {
            return <MdDelete />;
        }
        if (button === 'edit') {
            return <MdEdit />;
        }
        if (button === 'add') {
            return <MdAdd />;
        }
        if (button === 'copy') {
            return <MdCopyAll />;
        }
        if (button === 'call') {
            return <MdCall />;
        }

        return <MdCheckBoxOutlineBlank />; // Default case

    }
    const dynamicButtonAPI = (button: ButtonConfig, data: any) => {
        return (
            button.isShow && (
                <button
                    className="dynamic-table-action"
                    onClick={async () => {
                        await DynamicAPI(
                            button?.api?.method || 'GET',
                            `${button?.api?.url}${button?.api?.suffix ? `/${data[button.api.suffix]}` : ''}`
                        );
                        if(button?.api?.refresh) {
                            fetchTableData(pagination.page);
                        }
                    }}
                >
                    {renderButton(button.icon || "none")}
                </button>

            )
        )
    }
    const dynamicButtonOpenForm = (button: ButtonConfig, data: any) => {
        console.log(button.openForm && button.openForm != "");
        const form = forms.find(f => f.key === button.openForm);
        if (!form) {
            console.error(`Form with key ${button.openForm} not found`);
            return null;
        }
        return (
            button.isShow && (
                <button
                    className="dynamic-table-action"
                    onClick={() => {
                        if (form.initData && setInitData) {
                            console.log("Setting initial data for form:", data);
                            setInitData(data);
                        }
                        setFormConfig && setFormConfig(form);
                        setFormOpen && setFormOpen(true);
                    }}
                >
                    {renderButton(button.icon || "none")}
                </button>
            )
        )
    }
    console.log("DynamicTable render");
    return (
        <>

        <div className="dynamic-table-container">
            <table className="dynamic-table">
            <thead>
                <tr>
                {config?.map((col) => (
                    col.isShow && (
                        dynamicTH(col.key, col.label, col, col.sortable)
                    )
                ))}
                <th></th>
                </tr>
            </thead>

            <tbody>
                {dataList?.map((data) => (
                <tr key={data.id} className="row">
                    {config?.map((col) => (
                    col.isShow && (
                        dynamicTD(data, col.key)
                    )
                    ))}

                    <td>
                    <div className="dynamic-table-actions">
                        {buttons?.map((button) => (
                            button.isShow && checkPerm(button.permission) && (
                                (button.openForm && button.openForm != "") ?
                                    dynamicButtonOpenForm(button, data) :
                                    dynamicButtonAPI(button, data)
                            )
                        ))}
                    </div>
                    </td>
                </tr>
                ))}

            {dataList && dataList.length < pagination.limit && (
                Array.from({ length: pagination.limit - dataList.length }).map((_, index) => (
                <tr key={`${index}`} className="empty-row">
                    <td></td>
                </tr>
                )))
            }
            </tbody>

            </table>
        </div>
        <div className="dynamic-footer">
            <div className="footer-text">
            <div className="footer-text-info">
                Showing {Math.max(0,((pagination.page-1)*pagination.limit + 1))} - {Math.min(pagination.totalItems, pagination.page*pagination.limit)} of {pagination.totalItems} entries
            </div>
            <div className="footer-text-pagination">
                {paginationControls}
            </div>
            <div className="footer-text-select-limit">
                <span className="footer-text-select-label">Items per page: </span>
                <select
                className="footer-text-select"
                value={pagination.limit}
                onChange={(e) => {
                    setPagination(prev => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1
                    }));
                }}
                >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                </select>
            </div>
            </div>
        </div>
        </>
    );
}
export default DynamicTable;
