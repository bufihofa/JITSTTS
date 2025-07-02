import './Button.css';


interface ButtonProps {
    onAddButton: () => void;
    text: string;
}

const Button: React.FC<ButtonProps> = ({onAddButton, text}) =>{
    return(
        <button className="button" onClick={onAddButton}>{text}</button>
    )
}
export default Button;

