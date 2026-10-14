import type { YearMonth } from "../types";
import { addMonths, formatMonthLabel, isSameMonth, currentYearMonth } from "../lib/format";

interface MonthSelectorProps {
  value: YearMonth;
  onChange: (value: YearMonth) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const isCurrent = isSameMonth(value, currentYearMonth());

  return (
    <div className="month-selector">
      <button
        type="button"
        className="month-nav-button"
        onClick={() => onChange(addMonths(value, -1))}
        aria-label="Mes anterior"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div className="month-selector-label">
        <span className="month-selector-value">{formatMonthLabel(value)}</span>
        <button
          type="button"
          className="month-today-button"
          onClick={() => onChange(currentYearMonth())}
          disabled={isCurrent}
        >
          {isCurrent ? "Mes actual" : "Volver a hoy"}
        </button>
      </div>

      <button
        type="button"
        className="month-nav-button"
        onClick={() => onChange(addMonths(value, 1))}
        aria-label="Mes siguiente"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
