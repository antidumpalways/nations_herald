import { useEffect, useState } from 'react';

function groupByCategory(data: any[]) {
  const grouped: Record<string, any[]> = {};
  for (const item of data) {
    const cat = item.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }
  return grouped;
}

const allowedCategories = [
  '📰News',
  'Project Updates',
  'Threads/Reads',
  'Launches',
  'New Projects',
];
const categoryIcons: Record<string, string> = {
  '📰News': '📰📰',
  'Project Updates': '📢',
  'Threads/Reads': '📖',
  'Launches': '🚀',
  'New Projects': '✨',
};

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/scrape')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const grouped = groupByCategory(Array.isArray(data) ? data : []);

  // Grid 5 kolom tetap, scroll horizontal jika overflow
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 32,
    minWidth: 1600,
    alignItems: 'stretch',
  };
  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px #0001',
    padding: 24,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
  };

  return (
    <div style={{ maxWidth: '100vw', padding: 32, fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h1 style={{ fontSize: 36, marginBottom: 8, textAlign: 'center' }}>The Nation's Herald</h1>
      <p style={{ color: '#444', marginBottom: 32, textAlign: 'center' }}>Daily crypto news and project updates scraped from Telegram.</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <div style={gridStyle as any}>
          {allowedCategories.map(cat => (
            <section key={cat} style={cardStyle as any}>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#1a202c', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>{categoryIcons[cat] || ''}</span>
                {cat}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
                {(grouped[cat] && grouped[cat].length > 0) ? grouped[cat].map((item, i) => (
                  <li key={i} style={{ marginBottom: 18, background: '#f8f9fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{item.description}</div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }}>Read More &rarr;</a>
                    )}
                    {item.date && (
                      <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{item.date}</div>
                    )}
                  </li>
                )) : (
                  <li style={{ color: '#bbb', fontStyle: 'italic', textAlign: 'center', marginTop: 32 }}>No data</li>
                )}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
