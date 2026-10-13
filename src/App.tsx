
import { useMemo, useState } from "react";
import "./App.css";

type Transaction = {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  icon: string;
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    title: "Supermercado",
    category: "Alimentación",
    date: "2026-10-12",
    amount: 25400,
    type: "expense",
    icon: "🛒",
  },
  {
    id: 2,
    title: "Transporte",
    category: "Movilidad",
    date: "2026-10-11",
    amount: 8500,
    type: "expense",
    icon: "🚗",
  },
  {
    id: 3,
    title: "Café",
    category: "Comida",
    date: "2026-10-10",
    amount: 6200,
    type: "expense",
    icon: "☕",
  },
  {
    id: 4,
    title: "Sueldo",
    category: "Trabajo",
    date: "2026-10-02",
    amount: 850000,
    type: "income",
    icon: "💼",
  },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
});

function App() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Inicio");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] =
    useState<"expense" | "income">("expense");
  const [category, setCategory] = useState("Alimentación");

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonth = transactions.filter((transaction) => {
      const date = new Date(
        `${transaction.date}T12:00:00`
      );

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const income = thisMonth
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = thisMonth
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const allIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const allExpenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      income,
      expenses,
      balance: allIncome - allExpenses,
    };
  }, [transactions]);

  function addTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(amount.replace(",", "."));

    if (!title.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const icons: Record<string, string> = {
      Alimentación: "🛒",
      Transporte: "🚗",
      Vivienda: "🏠",
      Salud: "💊",
      Ocio: "🎮",
      Trabajo: "💼",
      Otros: "📌",
    };

    const newTransaction: Transaction = {
      id: Date.now(),
      title: title.trim(),
      category,
      date: new Date().toLocaleDateString("en-CA"),
      amount: Math.round(parsedAmount * 100) / 100,
      type,
      icon: icons[category] ?? "📌",
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Alimentación");
    setShowForm(false);
    setActiveTab("Inicio");
  }

  const visibleTransactions = transactions.slice(0, 5);

  const monthName = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TU ESPACIO PERSONAL</p>
          <h1>Mis finanzas<span>.</span></h1>
        </div>

        <div className="profile-icon" aria-label="Mi perfil">
          <span>F</span>
        </div>
      </header>

      <section className="balance-card">
        <div className="balance-top">
          <span>Balance total</span>
          <span className="balance-badge">ARS · $</span>
        </div>

        <p className="balance-amount">
          {currency.format(summary.balance)}
        </p>

        <p className="balance-caption">
          Resultado de tus movimientos de ejemplo
        </p>

        <div className="balance-divider" />

        <div className="summary-grid">
          <div>
            <span className="summary-label">
              <span className="summary-dot income-dot" />
              Ingresos del mes
            </span>
            <strong>{currency.format(summary.income)}</strong>
          </div>

          <div>
            <span className="summary-label">
              <span className="summary-dot expense-dot" />
              Gastos del mes
            </span>
            <strong>{currency.format(summary.expenses)}</strong>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          <span className="button-plus">+</span>
          Nuevo movimiento
        </button>
      </section>

      <section className="transactions-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TU ACTIVIDAD</p>
            <h2>Movimientos</h2>
          </div>

          <span className="month-label">{monthName}</span>
        </div>

        {visibleTransactions.length > 0 ? (
          <div className="transaction-list">
            {visibleTransactions.map((transaction) => (
              <article
                className="transaction-item"
                key={transaction.id}
              >
                <div className="transaction-icon">
                  {transaction.icon}
                </div>

                <div className="transaction-info">
                  <strong>{transaction.title}</strong>
                  <span>
                    {transaction.category} ·{" "}
                    {dateFormatter.format(
                      new Date(`${transaction.date}T12:00:00`)
                    )}
                  </span>
                </div>

                <strong
                  className={`transaction-amount ${transaction.type}`}
                >
                  {transaction.type === "income" ? "+" : "−"}
                  {currency.format(transaction.amount)}
                </strong>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>🧾</span>
            <strong>Todavía no hay movimientos</strong>
            <p>Registra tu primer ingreso o gasto.</p>
          </div>
        )}
      </section>

      <footer className="privacy-note">
        <span>🔒</span>
        Tus finanzas, a tu manera.
      </footer>

      <nav className="bottom-nav" aria-label="Navegación principal">
        {[
          { label: "Inicio", icon: "⌂" },
          { label: "Movimientos", icon: "⇄" },
          { label: "Estadísticas", icon: "▥" },
          { label: "Ajustes", icon: "⚙" },
        ].map((item) => (
          <button
            key={item.label}
            className={`nav-item ${
              activeTab === item.label ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab(item.label);
              if (item.label === "Movimientos") {
                document.querySelector(".transactions-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
              if (item.label === "Inicio") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {showForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowForm(false)}
        >
          <section
            className="transaction-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">NUEVO REGISTRO</p>
                <h2 id="form-title">Añadir movimiento</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>

            <form onSubmit={addTransaction}>
              <label className="field-label">Tipo de movimiento</label>

              <div className="type-switch">
                <button
                  type="button"
                  className={type === "expense" ? "selected expense-selected" : ""}
                  onClick={() => setType("expense")}
                >
                  − Gasto
                </button>
                <button
                  type="button"
                  className={type === "income" ? "selected income-selected" : ""}
                  onClick={() => setType("income")}
                >
                  + Ingreso
                </button>
              </div>

              <label className="field-label" htmlFor="movement-title">
                Descripción
              </label>
              <input
                id="movement-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. Compra del supermercado"
                maxLength={80}
                required
              />

              <label className="field-label" htmlFor="movement-amount">
                Importe en pesos
              </label>
              <div className="amount-input">
                <span>$</span>
                <input
                  id="movement-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              <label className="field-label" htmlFor="movement-category">
                Categoría
              </label>
              <select
                id="movement-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Alimentación</option>
                <option>Transporte</option>
                <option>Vivienda</option>
                <option>Salud</option>
                <option>Ocio</option>
                <option>Trabajo</option>
                <option>Otros</option>
              </select>

              <button className="primary-button submit-button" type="submit">
                Guardar movimiento
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;

