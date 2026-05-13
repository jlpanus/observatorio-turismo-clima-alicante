"use client";

import { FormEvent, useState } from "react";

type ChatInputProps = {
  disabled?: boolean;
  onSubmit: (message: string) => void;
};

export function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = value.trim();
    if (!message || disabled) return;
    setValue("");
    onSubmit(message);
  }

  return (
    <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="barbara-message">
        Escribe tu consulta para Bárbara
      </label>
      <input
        className="focus-ring min-h-12 flex-1 rounded-full border border-alicante-border bg-white px-5 text-sm font-medium text-alicante-ink shadow-soft placeholder:text-alicante-muted"
        disabled={disabled}
        id="barbara-message"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ej. Voy con niños y quiero evitar calor..."
        type="text"
        value={value}
      />
      <button className="primary-pill disabled:cursor-not-allowed disabled:opacity-60" disabled={disabled || !value.trim()} type="submit">
        Enviar
      </button>
    </form>
  );
}
