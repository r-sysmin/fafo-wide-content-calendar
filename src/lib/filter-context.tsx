import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface FilterState {
  rangeStart: string;
  rangeEnd: string;
  platform: string | undefined;
  contentPillarId: string | undefined;
  status: string | undefined;
}

interface FilterContextValue {
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

function getDefaultWeekRange(): { rangeStart: string; rangeEnd: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return {
    rangeStart: monday.toISOString(),
    rangeEnd: sunday.toISOString(),
  };
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const defaults = getDefaultWeekRange();
  const [filters, setFiltersState] = useState<FilterState>({
    rangeStart: defaults.rangeStart,
    rangeEnd: defaults.rangeEnd,
    platform: undefined,
    contentPillarId: undefined,
    status: undefined,
  });

  const setFilters = useCallback((updates: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be inside FilterProvider');
  return ctx;
}
