import type { ReactElement, SVGProps } from "react";
import type { SectionId } from "../types";

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 7h14M5 12h14M5 17h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 19v-6M12 19V6M18 19v-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3.5v2M12 18.5v2M4.9 7.5l1.7 1M17.4 15.5l1.7 1M4.9 16.5l1.7-1M17.4 8.5l1.7-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface NavItemConfig {
  id: SectionId;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "inicio", label: "Inicio", Icon: HomeIcon },
  { id: "movimientos", label: "Movimientos", Icon: ListIcon },
  { id: "estadisticas", label: "Estadísticas", Icon: ChartIcon },
  { id: "ajustes", label: "Ajustes", Icon: SettingsIcon },
];

interface BottomNavProps {
  active: SectionId;
  onChange: (section: SectionId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            className={`nav-item ${isActive ? "active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(id)}
          >
            <Icon className="nav-icon" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
