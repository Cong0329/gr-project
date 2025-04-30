
import { BaseEntity, EntityConfig, FieldConfig } from './types';

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
                    <select
                        name={field.name}
                        value={item[field.name] || ''}
                        onChange={onChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={field.required}
                    >
                        <option value="">Chọn {field.label.toLowerCase()}</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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