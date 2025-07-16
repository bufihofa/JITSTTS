import './Input.css';
interface CMSInputProps{
    label: string;
    placeholder?: string;
    type?: string;
    value: any;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: any) => void;
}
const CMSInput: React.FC<CMSInputProps> = ({label, placeholder, type, value, onChange, disabled, required}) => {
    return(
        <div className="input-container">
            <label className="input-label">{label}</label>
            <br />
            <input 
                className="input-input"
                type={type || "text"}
                value={value} 
                placeholder={placeholder || ""}
                onChange={(e) => onChange && onChange(e.target.value)} 
                disabled={disabled}
                required={required}
            />
        </div>
    )
}
export default CMSInput;