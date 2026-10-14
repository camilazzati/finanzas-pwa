import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { TransactionDraft, TransactionType } from "../types";
import { CATEGORIES, DEFAULT_CATEGORY } from "../lib/transactions";
import { parseAmount } from "../lib/format";

interface TransactionFormProps {
  onSubmit: (draft: TransactionDraft) => void;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  amount?: string;
}

export function TransactionForm({ onSubmit, onClose }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [errors, setErrors] = useState<FormErrors>({});

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const parsedAmount = parseAmount(amount);

    if (!trimmedTitle) {
      nextErrors.title = "Ingresá una descripción.";
    }

    if (Number.isNaN(parsedAmount)) {
      nextErrors.amount = "Ingresá un importe válido.";
    } else if (parsedAmount <= 0) {
      nextErrors.amount = "El importe debe ser mayor a cero.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: trimmedTitle,
      category,
      amount: Math.round(parsedAmount * 100) / 100,
      type,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      data-testid="modal-backdrop"
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
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <span className="field-label" id="type-label">
            Tipo de movimiento
          </span>
          <div
            className="type-switch"
            role="group"
            aria-labelledby="type-label"
          >
            <button
              type="button"
              className={
                type === "expense" ? "selected expense-selected" : ""
              }
              aria-pressed={type === "expense"}
              onClick={() => setType("expense")}
            >
              − Gasto
            </button>
            <button
              type="button"
              className={type === "income" ? "selected income-selected" : ""}
              aria-pressed={type === "income"}
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
            ref={titleRef}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Ej. Compra del supermercado"
            maxLength={80}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "movement-title-error" : undefined}
          />
          {errors.title && (
            <p className="field-error" id="movement-title-error" role="alert">
              {errors.title}
            </p>
          )}

          <label className="field-label" htmlFor="movement-amount">
            Importe en pesos
          </label>
          <div className="amount-input">
            <span aria-hidden="true">$</span>
            <input
              id="movement-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                if (errors.amount)
                  setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="0,00"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={
                errors.amount ? "movement-amount-error" : undefined
              }
            />
          </div>
          {errors.amount && (
            <p className="field-error" id="movement-amount-error" role="alert">
              {errors.amount}
            </p>
          )}

          <label className="field-label" htmlFor="movement-category">
            Categoría
          </label>
          <select
            id="movement-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button className="primary-button submit-button" type="submit">
              Guardar movimiento
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
