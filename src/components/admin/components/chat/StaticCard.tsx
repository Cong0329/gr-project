export const StatisticCard = ({ title, value, color }: { title: string, value: number, color: string }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
};