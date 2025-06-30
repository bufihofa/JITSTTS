import './SelectTab.css'
interface SelectTabProps{
    leftTab: string;
    rightTab: string;
    isLeft: boolean;
    disableLeft?: boolean;
    disableRight?: boolean;
    setLeft: (isLeft: boolean) => void;
}
const SelectTab: React.FC<SelectTabProps> = ({leftTab, rightTab, isLeft, setLeft, disableLeft, disableRight}) => {

    return (
      <div className="tab-container">
        <button 
          className={`select-left ${isLeft ? 'active-tab' : ''}`}
          onClick={() => setLeft(true)}
          disabled={disableLeft}
        >
          {leftTab}</button>
        <button 
          className={`select-right ${!isLeft ? 'active-tab' : ''}`}
          onClick={() => setLeft(false)}
          disabled={disableRight}
        >
          {rightTab}</button>
        <div 
          className="tab-indicator" 
          style={{ transform: isLeft ? 'translateX(0)' : 'translateX(100%)' }}
        ></div>
      </div>
    )
}
export default SelectTab;