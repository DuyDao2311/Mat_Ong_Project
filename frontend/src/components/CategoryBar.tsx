import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  'MẬT ONG NGÂM': <img src="/mat-ong-bac-ha.png" alt="Mật ong ngâm" className="category-image-icon" />,
  'MẬT ONG NGUYÊN CHẤT': <img src="/mat-ong-nui-da.png" alt="Mật ong nguyên chất" className="category-image-icon" />,
};

function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="category-bar" id="category-bar">
      <div className="category-list">
        {categories.map((cat, index) => (
          <div
            key={cat._id}
            className="category-item"
            id={`category-${index}`}
            onClick={() => handleCategoryClick(cat.name)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-icon">{iconMap[cat.name.toUpperCase()] || iconMap[cat.name] || '📦'}</div>
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryBar;
