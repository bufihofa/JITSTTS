import './Input.css';
interface CMSInputProps{
    label: string;
    placeholder?: string;
    type?: string;
    value: any;
    disabled?: boolean;
    onChange?: (value: any) => void;
}
const CMSInput: React.FC<CMSInputProps> = ({label, placeholder, type, value, onChange, disabled}) => {
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
            />
        </div>
    )
}
export default CMSInput;