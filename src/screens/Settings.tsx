import type { ResolvedTheme, ThemeMode } from "../types";

interface SettingsProps {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  onModeChange: (mode: ThemeMode) => void;
}

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Claro", icon: "☀️" },
  { value: "dark", label: "Oscuro", icon: "🌙" },
  { value: "system", label: "Sistema", icon: "⚙️" },
];

const SYSTEM_LABEL: Record<ResolvedTheme, string> = {
  light: "claro",
  dark: "oscuro",
};

export function Settings({ mode, resolved, onModeChange }: SettingsProps) {
  return (
    <>
      <section className="screen-heading">
        <div>
          <p className="eyebrow">TUS PREFERENCIAS</p>
          <h2>Ajustes</h2>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <h3>Apariencia</h3>
          <p>Elegí cómo se ve la aplicación. La preferencia se guarda en este dispositivo.</p>
        </div>

        <div className="theme-options" role="radiogroup" aria-label="Tema de la aplicación">
          {THEME_OPTIONS.map((option) => {
            const isSelected = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`theme-option ${isSelected ? "selected" : ""}`}
                onClick={() => onModeChange(option.value)}
              >
                <span className="theme-option-icon" aria-hidden="true">
                  {option.icon}
                </span>
                <span className="theme-option-label">{option.label}</span>
                {option.value === "system" && (
                  <span className="theme-option-hint">
                    Usa el tema {SYSTEM_LABEL[resolved]} del sistema
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="settings-card">
        <h3>Idioma y moneda</h3>
        <div className="settings-row">
          <span>Idioma</span>
          <strong>Español</strong>
        </div>
        <div className="settings-row">
          <span>Moneda</span>
          <strong>Peso argentino (ARS)</strong>
        </div>
      </section>

      <section className="settings-card">
        <h3>Datos</h3>
        <p>
          Esta versión muestra movimientos de ejemplo. Los movimientos que agregás
          se conservan solo mientras la aplicación está abierta.
        </p>
      </section>
    </>
  );
}
