interface StepOneProps {
    title: string;
    setTitle: (title: string) => void;
    onCreateBlog: () => void;
  }
  
  export const StepOne: React.FC<StepOneProps> = ({ title, setTitle, onCreateBlog }) => {
    return (
      <div className="space-y-4">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Nhập tiêu đề blog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onCreateBlog}
        >
          Tạo Blog
        </button>
      </div>
    );
  };
  