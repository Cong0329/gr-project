import { Link } from 'react-router-dom';
import { BaseEntity, EntityConfig } from './types';
import { useDispatch } from 'react-redux';
import { resetBrand } from '../../../../../../redux/brandSlice';
interface GenericTableProps<T extends BaseEntity> {
  items: T[];
  config: EntityConfig<T>;
  link: string;
  onReset: () => void;
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

function GenericTable<T extends BaseEntity>({
  items,
  config,
  link,
  onReset,
  onView,
  onEdit,
  onDelete
}: GenericTableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {config.tableColumns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              {config.tableColumns.map((column) => (
                <td
                  key={`${item.id}-${String(column.key)}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.key === 'logo' && item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-12 w-12 object-cover" />
                  ) : column.render ? column.render(item) : item[column.key as keyof T]}
                  {column.key === 'role' && (
                    <span className={`${item.roles?.[0].code === 'ROLE_ADMIN' ? 'bg-green-100 text-green-700' : item.roles?.[0].code === 'ROLE_DOCTOR' ? 'bg-blue-100 text-blue-700' : 'text-red-700 bg-red-100'}  text-xs text-center font-medium px-2 py-1  rounded-full`}>
                      {item.roles?.[0].name}
                    </span>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {link === 'user' ? (
                  <button onClick={() => onView(item)} className="text-blue-600 hover:text-blue-900 mr-3">Xem</button>
                ) : (
                  <Link
                    to={`/admin/${link}/${item.name}`}
                    onClick={onReset}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Xem
                  </Link>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="text-green-600 hover:text-green-900 mr-3"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td
                colSpan={config.tableColumns.length + 1}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có {config.name} nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;