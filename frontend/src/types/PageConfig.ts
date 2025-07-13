export interface Setting {
    id: string; // id của setting
    show?: boolean; // có hiển thị setting này hay không
    config: PageConfig; // cấu hình của trang, sử dụng interface PageConfig
}
export interface PageConfig {
    permission?: string, //quyền truy cập trang
    pageTitle?: string, //title của trang
    pageIcon?: string, //icon của trang
    table:{
        initialSortBy: string,  //cột sắp xếp mặc định
        initialSortDirection: string, //hướng sắp xếp mặc định

        //cấu hình các cột của bảng
        columns: {  
            key: string, // key của cột, dùng để truy cập dữ liệu
            label: string, // tên hiển thị của cột
            width?: number, // chiều rộng của cột, tính theo phần trăm
            sortable?: boolean, // có thể sắp xếp cột này hay không
            type?: 'text' | 'number' | 'date' | 'boolean', // kiểu dữ liệu của cột
            defaultValue?: any, // giá trị mặc định nếu không có dữ liệu
            isShow?: boolean // có hiển thị cột này hay không
        }[],
        
        api: APIConfig // cấu hình API cho bảng

    },
    action:{
        // nút chính trên trang, thường là nút thêm mới
        mainButton:{
            permission?: string, // quyền để hiển thị nút chính
            key: string, // key của nút, dùng để truy cập dữ liệu
            label: string, // tên hiển thị của nút
            isShow?: boolean, // có hiển thị nút này hay không
            openForm?: string, // key của form để mở khi nhấn nút
            api?: APIConfig // nếu không mở form, nút sẽ gọi API
        },
        // các nút trên từng hàng của bảng
        tableButtons?:{
            permission?: string, // quyền để hiển thị nút trên hàng
            key: string, // key của nút
            label: string, // tên hiển thị của nút
            icon?: string, // icon của nút
            isShow?: boolean, // có hiển thị nút này hay không
            openForm?: string, // key của form để mở khi nhấn nút
            api?: APIConfig // nếu không mở form, nút sẽ gọi API
        }[],
    },

    form: FormConfig[] // danh sách các form trên trang, mỗi form có cấu hình riêng
}

export interface APIConfig {
    method: string, // phương thức HTTP (GET, POST, PUT, PATCH, DELETE)
    url: string, // URL của API
    params?: Record<string, any>, // tham số truy vấn cho GET
    body?: Record<string, any>, // dữ liệu gửi đi cho POST, PUT, PATCH
    suffix?: string, // đuôi URL, ví dụ /:id
    refresh?: boolean // có làm mới table sau khi gọi API hay không
}

export interface FormConfig {
    key: string,  // key của form
    name: string, // tên hiển thị của form
    initData?: boolean,  // form có lấy dữ liệu khởi tạo không, ví dụ edit form sẽ có sẵn giá trị hiện tại của product
    // cấu hình các trường trong form
    fields: {  
        key: string, // key của trường, dùng để truy cập dữ liệu
        label: string, // tên hiển thị của trường
        type: 'text' | 'number' | 'date' | 'boolean' | 'select', // kiểu dữ liệu của trường
        options?: { value: string, label: string }[], // nếu là select, danh sách các tùy chọn
        defaultValue?: any, // giá trị mặc định nếu không có dữ liệu
        required?: boolean, // trường có bắt buộc hay không
        disabled?: boolean, // trường có bị vô hiệu hóa hay không
    }[],
    api?: APIConfig // khi submit form, sẽ gọi API này
}