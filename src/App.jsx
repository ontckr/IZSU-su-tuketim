import React, { useState, useEffect, useMemo } from 'react';
import { parseCSV, getUniqueValues, aggregateData } from './utils/csvParser';
import FilterPanel from './components/FilterPanel';
import {
  ChartCard,
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
} from './components/ChartCard';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    yil: '',
    ilce: '',
    mahalle: '',
    abonelikGrubu: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.BASE_URL;
        const parsedData = await parseCSV(`${baseUrl}izsu-yillik-ilce-mahalle-su-tuketimi.csv`);
        setData(parsedData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (filters.yil && row.YIL !== parseInt(filters.yil)) return false;
      if (filters.ilce && row.ILCE !== filters.ilce) return false;
      if (filters.mahalle && row.MAHALLE !== filters.mahalle) return false;
      if (filters.abonelikGrubu && row.ABONELIK_GRUBU !== filters.abonelikGrubu) return false;
      return true;
    });
  }, [data, filters]);

  const uniqueValues = useMemo(() => {
    if (!data.length) return {};
    
    const ilceFiltered = filters.ilce
      ? data.filter((row) => row.ILCE === filters.ilce)
      : data;

    return {
      yil: getUniqueValues(data, 'YIL'),
      ilce: getUniqueValues(data, 'ILCE'),
      mahalle: getUniqueValues(ilceFiltered, 'MAHALLE'),
      abonelikGrubu: getUniqueValues(data, 'ABONELIK_GRUBU'),
    };
  }, [data, filters.ilce]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key === 'ilce') {
        newFilters.mahalle = '';
      }
      return newFilters;
    });
  };

  const yearlyConsumption = useMemo(() => {
    const aggregated = aggregateData(filteredData, 'YIL', 'ORTALAMA_TUKETIM');
    return aggregated.map(item => ({
      ...item,
      YIL: item.YIL.toString(),
      YIL_NUM: parseInt(item.YIL)
    })).sort((a, b) => a.YIL_NUM - b.YIL_NUM);
  }, [filteredData]);

  const districtConsumption = useMemo(() => {
    const aggregated = aggregateData(filteredData, 'ILCE', 'ORTALAMA_TUKETIM');
    return aggregated
      .sort((a, b) => b.ORTALAMA_TUKETIM - a.ORTALAMA_TUKETIM)
      .slice(0, 10);
  }, [filteredData]);

  const subscriptionGroupData = useMemo(() => {
    return aggregateData(filteredData, 'ABONELIK_GRUBU', 'ORTALAMA_TUKETIM');
  }, [filteredData]);

  const monthlyConsumption = useMemo(() => {
    const monthly = {};
    filteredData.forEach((row) => {
      const key = `${row.YIL}-${String(row.AY).padStart(2, '0')}`;
      if (!monthly[key]) {
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        monthly[key] = { 
          period: `${monthNames[row.AY - 1] || row.AY} ${row.YIL}`, 
          sortKey: `${row.YIL}-${String(row.AY).padStart(2, '0')}`,
          consumption: 0 
        };
      }
      monthly[key].consumption += row.ORTALAMA_TUKETIM;
    });
    return Object.values(monthly).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filteredData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const totalConsumption = filteredData.reduce((sum, row) => sum + row.ORTALAMA_TUKETIM, 0);
  const totalSubscribers = filteredData.reduce((sum, row) => sum + row.ABONE_ADEDI, 0);
  const avgConsumption = totalSubscribers > 0 ? (totalConsumption / totalSubscribers).toFixed(2) : 0;

  const formatLargeNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toLocaleString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                💧 İZSU Su Tüketim Dashboard
              </h1>
              <p className="mt-2 text-gray-600 font-medium">
                Yıllık İlçe ve Mahalle Su Tüketim Analizi
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {filteredData.length.toLocaleString('tr-TR')} kayıt
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          uniqueValues={uniqueValues}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 text-white card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span className="text-blue-100 text-sm font-medium">Toplam</span>
            </div>
            <h3 className="text-sm font-medium text-blue-100 mb-2">Toplam Tüketim</h3>
            <p className="text-4xl font-bold">
              {formatLargeNumber(totalConsumption)}
            </p>
            <p className="text-blue-100 text-sm mt-1">m³</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-xl p-6 text-white card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-green-100 text-sm font-medium">Abone</span>
            </div>
            <h3 className="text-sm font-medium text-green-100 mb-2">Toplam Abone</h3>
            <p className="text-4xl font-bold">
              {formatLargeNumber(totalSubscribers)}
            </p>
            <p className="text-green-100 text-sm mt-1">abone</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl p-6 text-white card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-lg p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-purple-100 text-sm font-medium">Ortalama</span>
            </div>
            <h3 className="text-sm font-medium text-purple-100 mb-2">Ortalama Tüketim</h3>
            <p className="text-4xl font-bold">
              {avgConsumption.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-purple-100 text-sm mt-1">m³/abone</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard 
            title="Yıllara Göre Tüketim Trendi"
            description="Yıllar bazında toplam su tüketiminin değişimi"
          >
            <LineChartComponent
              data={yearlyConsumption}
              dataKey="ORTALAMA_TUKETIM"
              xKey="YIL"
              label="Tüketim (m³)"
            />
          </ChartCard>

          <ChartCard 
            title="Abonelik Grubuna Göre Dağılım"
            description="Farklı abonelik gruplarının tüketim payları"
          >
            <PieChartComponent
              data={subscriptionGroupData}
              dataKey="ORTALAMA_TUKETIM"
              nameKey="ABONELIK_GRUBU"
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <ChartCard 
            title="İlçelere Göre Tüketim - En Yüksek 10 İlçe"
            description="Tüketim miktarına göre sıralanmış ilçeler"
          >
            <BarChartComponent
              data={districtConsumption}
              dataKey="ORTALAMA_TUKETIM"
              xKey="ILCE"
              label="Tüketim (m³)"
            />
          </ChartCard>
        </div>

        {monthlyConsumption.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <ChartCard 
              title="Aylık Tüketim Trendi"
              description="Zaman içinde aylık bazda tüketim değişimi"
            >
              <LineChartComponent
                data={monthlyConsumption}
                dataKey="consumption"
                xKey="period"
                label="Tüketim (m³)"
              />
            </ChartCard>
          </div>
        )}
      </main>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            İzmir Büyükşehir Belediyesi Açık Veri Portalı kullanılarak oluşturulmuştur.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
