interface PageConfig {
    pageTitle: string,
    pageIcon: string,

    table:{
        initialSortBy: string,
        initialSortDirection: string,

        columns: {
            key: string,
            label: string,
            sortable?: boolean,
            type?: 'text' | 'number' | 'date' | 'boolean',
            defaultValue?: any,
            isShow?: boolean
        }[],
        
        api:{
            method: string,
            url: string,
            params?: Record<string, any>,
            body?: Record<string, any>
        }

    },
    action:{
        mainButton:{
            key: string,
            label: string,
            isShow?: boolean,
            openForm?: string,
            api:{
                method: string,
                url: string,
                params?: Record<string, any>,
                body?: Record<string, any>
            }
        },
        tableButtons?:{
            key: string,
            label: string,
            isShow?: boolean,
            openForm?: string,
            api:{
                method: string,
                url: string,
                params?: Record<string, any>,
                body?: Record<string, any>
            }
        }[],
    },
    form:{
        name: string,
        fields: {
            key: string,
            label: string,
            type: 'text' | 'number' | 'date' | 'boolean' | 'select',
            options?: { value: string, label: string }[],
            defaultValue?: any,
            required?: boolean
        }[],
        api:{
            method: string,
            url: string,
            params?: Record<string, any>,
            body?: Record<string, any>
        }
    }


    
}