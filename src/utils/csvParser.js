import Papa from 'papaparse';

export const parseCSV = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map(row => ({
            ...row,
            YIL: parseInt(row.YIL) || 0,
            AY: parseInt(row.AY) || 0,
            ABONE_ADEDI: parseInt(row.ABONE_ADEDI) || 0,
            ORTALAMA_TUKETIM: parseInt(row.ORTALAMA_TUKETIM) || 0,
          }));
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('CSV parse error:', error);
    throw error;
  }
};

export const getUniqueValues = (data, field) => {
  return [...new Set(data.map(item => item[field]))].filter(Boolean).sort();
};

export const aggregateData = (data, groupBy, sumField) => {
  const grouped = {};
  
  data.forEach(row => {
    const key = row[groupBy];
    if (!grouped[key]) {
      grouped[key] = 0;
    }
    grouped[key] += row[sumField] || 0;
  });
  
  return Object.entries(grouped)
    .map(([key, value]) => ({ [groupBy]: key, [sumField]: value }))
    .sort((a, b) => {
      if (typeof a[groupBy] === 'number') {
        return a[groupBy] - b[groupBy];
      }
      return a[groupBy].localeCompare(b[groupBy]);
    });
};
