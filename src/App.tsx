import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { useTools, Tool } from './hooks/useTools';
import { useState, useEffect } from 'react';

// Компонент кнопки
function Button({ children, onClick, variant = 'primary', disabled, type = 'button' }: any) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

// Компонент загрузки
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Компонент карточки инструмента
function ToolCard({ tool, onEdit, onDelete, onToggleFavorite }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
        <button
          onClick={() => onToggleFavorite(tool.id, tool.is_favorite)}
          className="text-yellow-500 hover:text-yellow-600"
        >
          {tool.is_favorite ? '★' : '☆'}
        </button>
      </div>
      <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
      <div className="flex justify-between items-center text-sm mb-3">
        <span className="text-gray-500">Category: {tool.category}</span>
        <span className="font-semibold text-blue-600">${tool.price}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500">Quantity: {tool.quantity}</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => onEdit(tool.id)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(tool.id)}>Delete</Button>
      </div>
    </div>
  );
}

// Страница каталога
function CatalogPage() {
  const navigate = useNavigate();
  const { tools, loading, error, deleteTool, updateTool, loadTools } = useTools();

  const handleEdit = (id: string) => navigate(`/edit/${id}`);
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) await deleteTool(id);
  };
  const handleToggleFavorite = async (id: string, currentState: boolean) => {
    await updateTool(id, { is_favorite: !currentState });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tool Catalog</h1>
        <p className="text-gray-600 mt-2">Browse and manage your tool collection</p>
      </div>
      {tools.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No tools yet. Add your first tool!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Страница избранного
function FavoritesPage() {
  const navigate = useNavigate();
  const { tools, loading, error, deleteTool, updateTool, loadTools } = useTools();
  const favorites = tools.filter(t => t.is_favorite);

  const handleEdit = (id: string) => navigate(`/edit/${id}`);
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) await deleteTool(id);
  };
  const handleToggleFavorite = async (id: string, currentState: boolean) => {
    await updateTool(id, { is_favorite: !currentState });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Favorite Tools</h1>
        <p className="text-gray-600 mt-2">Your most trusted tools</p>
      </div>
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No favorite tools yet. Star some tools!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Форма добавления/редактирования
function ToolFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tools, addTool, updateTool } = useTools();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    if (id && tools.length > 0) {
      const tool = tools.find(t => t.id === id);
      if (tool) {
        setFormData({
          name: tool.name,
          description: tool.description,
          category: tool.category,
          price: tool.price.toString(),
          quantity: tool.quantity.toString()
        });
      }
    }
  }, [id, tools]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const toolData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      is_favorite: false,
      image_url: null
    };

    let success;
    if (id) {
      success = await updateTool(id, toolData);
    } else {
      success = await addTool(toolData as any);
    }
    
    setLoading(false);
    if (success) navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Tool' : 'Add New Tool'}
        </h1>
        <p className="text-gray-600 mt-2">
          {id ? 'Update tool information' : 'Add a new tool to your inventory'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="Power Tools">Power Tools</option>
            <option value="Hand Tools">Hand Tools</option>
            <option value="Measuring Tools">Measuring Tools</option>
            <option value="Safety Equipment">Safety Equipment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
            <input
              type="number"
              name="quantity"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Tool' : 'Add Tool')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// Layout компонент
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Tool Inventory
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Catalog</Link>
              <Link to="/favorites" className="text-gray-600 hover:text-blue-600 transition-colors">Favorites</Link>
              <Link to="/add" className="text-gray-600 hover:text-blue-600 transition-colors">Add Tool</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

// Главный компонент App
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/add" element={<ToolFormPage />} />
          <Route path="/edit/:id" element={<ToolFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;