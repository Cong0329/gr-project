
import { EyeCloseIcon, EyeIcon } from '../../../../icons';
import { BaseEntity, EntityConfig, FieldConfig } from './types';
import Select from 'react-select';
interface GenericFormProps<T extends BaseEntity> {
    item: T;
    config: EntityConfig<T>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    readOnly?: boolean;
}

function GenericForm<T extends BaseEntity>({
    item,
    config,
    onChange,
    readOnly = false
}: GenericFormProps<T>) {
    const renderField = (field: FieldConfig) => {
        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        name={field.name}
                        value={item[field.name] || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        required={field.required}
                    />
                );

            case 'select':
                return (
                    <Select
                        value={field.options?.find(opt => opt.value === item[field.name]) || null}
                        onChange={(selectedOption) => {
                            const customEvent = {
                                target: {
                                    name: field.name,
                                    value: selectedOption?.value || ''
                                }
                            } as React.ChangeEvent<HTMLInputElement>; // giả lập event để tương thích
                            onChange(customEvent);
                        }}
                        options={field.options}
                        isDisabled={readOnly}
                        isSearchable={true}
                        placeholder={`Chọn ${field.label.toLowerCase()}`}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: 200, // Giới hạn chiều cao dropdown
                              overflowY: 'auto',
                            }),
                          }}
                    />
                );


            case 'number':
                return (
                    <input
                        type="number"
                        name={field.name}
                        value={item[field.name] || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={field.required}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        name={field.name}
                        value={item[field.name] || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={field.required}
                    />
                );

            case 'file':
                return (
                    <input
                        type="file"
                        name={field.name}
                        onChange={onChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={field.required}
                    />
                );

         

            default:
                return (
                    <input
                        type="text"
                        name={field.name}
                        value={item[field.name] || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={field.required}
                    />
                );
        }
    };

    return (
        <div className="space-y-4">
            {config.fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                </div>
            ))}
        </div>
    );
}

export default GenericForm;