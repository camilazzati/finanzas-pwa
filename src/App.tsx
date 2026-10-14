import { useCallback, useEffect, useState } from "react";
import type { SectionId, Transaction, TransactionDraft, YearMonth } from "./types";
import { currentYearMonth, toISODate } from "./lib/format";
import { categoryIcon, createSampleTransactions, createTransactionId } from "./lib/transactions";
import { useTheme } from "./hooks/useTheme";
import { BottomNav } from "./components/BottomNav";
import { TransactionForm } from "./components/TransactionForm";
import { Dashboard } from "./screens/Dashboard";
import { Movements } from "./screens/Movements";
import { Stats } from "./screens/Stats";
import { Settings } from "./screens/Settings";
import "./App.css";

function App() {
  const { mode, resolved, setMode } = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    createSampleTransactions(),
  );
  const [activeSection, setActiveSection] = useState<SectionId>("inicio");
  const [selectedMonth, setSelectedMonth] = useState<YearMonth>(currentYearMonth);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleAddTransaction = useCallback((draft: TransactionDraft) => {
    const newTransaction: Transaction = {
      id: createTransactionId(),
      title: draft.title,
      category: draft.category,
      date: toISODate(new Date()),
      amount: draft.amount,
      type: draft.type,
      icon: categoryIcon(draft.category),
    };

    setTransactions((previous) => [newTransaction, ...previous]);
    setSelectedMonth(currentYearMonth());
    setShowForm(false);
    setActiveSection((current) => (current === "ajustes" ? "inicio" : current));
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TU ESPACIO PERSONAL</p>
          <h1>
            Mis finanzas<span>.</span>
          </h1>
        </div>

        <div className="profile-icon" aria-hidden="true">
          <span>F</span>
        </div>
      </header>

      {activeSection === "inicio" && (
        <Dashboard
          transactions={transactions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onAdd={() => setShowForm(true)}
          onSeeAll={() => setActiveSection("movimientos")}
        />
      )}

      {activeSection === "movimientos" && (
        <Movements
          transactions={transactions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onAdd={() => setShowForm(true)}
        />
      )}

      {activeSection === "estadisticas" && (
        <Stats
          transactions={transactions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      )}

      {activeSection === "ajustes" && (
        <Settings mode={mode} resolved={resolved} onModeChange={setMode} />
      )}

      <footer className="privacy-note">
        <span aria-hidden="true">🔒</span>
        Tus finanzas, a tu manera.
      </footer>

      <BottomNav active={activeSection} onChange={setActiveSection} />

      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}

export default App;
