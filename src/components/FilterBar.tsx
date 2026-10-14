import type { TypeFilter } from "../types";

interface FilterBarProps {
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categories: string[];
}

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Ingresos" },
  { value: "expense", label: "Gastos" },
];

export function FilterBar({
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-switch" role="group" aria-label="Filtrar por tipo">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-chip ${
              typeFilter === option.value ? "selected" : ""
            }`}
            aria-pressed={typeFilter === option.value}
            onClick={() => onTypeFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className="filter-category">
        <span className="visually-hidden">Filtrar por categoría</span>
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
