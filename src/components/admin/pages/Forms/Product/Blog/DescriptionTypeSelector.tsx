import { DescriptionType, descriptionTypeLabels } from "./type";










interface DescriptionTypeSelectorProps {
  onSelect: (type: DescriptionType) => void;
  disabledTypes: DescriptionType[];
}



export const DescriptionTypeSelector: React.FC<DescriptionTypeSelectorProps> = ({ onSelect, disabledTypes }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.values(DescriptionType).map((type) => (
        <button
          key={type}
          className="border p-2 rounded hover:bg-blue-100 disabled:opacity-50"
          onClick={() => onSelect(type)}
          disabled={disabledTypes.includes(type as DescriptionType)}
        >
            {descriptionTypeLabels[type as DescriptionType]}
        </button>
      ))}
    </div>
  );
};