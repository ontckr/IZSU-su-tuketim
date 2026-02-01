import React from 'react';

const FilterPanel = ({ filters, onFilterChange, uniqueValues }) => {
  const hasActiveFilters = filters.yil || filters.ilce || filters.mahalle || filters.abonelikGrubu;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Filtreler</h2>
          <p className="text-sm text-gray-500 mt-1">Verileri filtreleyerek detaylı analiz yapın</p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              onFilterChange('yil', '');
              onFilterChange('ilce', '');
              onFilterChange('mahalle', '');
              onFilterChange('abonelikGrubu', '');
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
          >
            ✕ Tümünü Temizle
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📅 Yıl
          </label>
          <select
            value={filters.yil || ''}
            onChange={(e) => onFilterChange('yil', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
          >
            <option value="">Tüm Yıllar</option>
            {uniqueValues.yil?.map((yil) => (
              <option key={yil} value={yil}>
                {yil}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏛️ İlçe
          </label>
          <select
            value={filters.ilce || ''}
            onChange={(e) => onFilterChange('ilce', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
          >
            <option value="">Tüm İlçeler</option>
            {uniqueValues.ilce?.map((ilce) => (
              <option key={ilce} value={ilce}>
                {ilce}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏘️ Mahalle
          </label>
          <select
            value={filters.mahalle || ''}
            onChange={(e) => onFilterChange('mahalle', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!filters.ilce}
          >
            <option value="">Tüm Mahalleler</option>
            {uniqueValues.mahalle?.map((mahalle) => (
              <option key={mahalle} value={mahalle}>
                {mahalle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📋 Abonelik Grubu
          </label>
          <select
            value={filters.abonelikGrubu || ''}
            onChange={(e) => onFilterChange('abonelikGrubu', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
          >
            <option value="">Tüm Gruplar</option>
            {uniqueValues.abonelikGrubu?.map((grup) => (
              <option key={grup} value={grup}>
                {grup}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
