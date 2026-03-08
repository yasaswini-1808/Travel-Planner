import { useEffect, useState } from "react";

/* Currency metadata */
const currencyMap = {
  usd: { name: "US Dollar", flag: "🇺🇸" },
  inr: { name: "Indian Rupee", flag: "🇮🇳" },
  eur: { name: "Euro", flag: "🇪🇺" },
  gbp: { name: "British Pound", flag: "🇬🇧" },
  jpy: { name: "Japanese Yen", flag: "🇯🇵" },
  aud: { name: "Australian Dollar", flag: "🇦🇺" },
  cad: { name: "Canadian Dollar", flag: "🇨🇦" },
};

const currencies = Object.keys(currencyMap);

export default function Currency({ onConvert }) {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`,
      );
      const data = await res.json();

      const rate = data[from][to];
      const converted = (amount * rate).toFixed(2);

      setResult(converted);

      // ✅ emit data to parent
      if (onConvert) {
        onConvert({
          amount,
          from,
          to,
          converted,
        });
      }
    } catch {
      setError("Failed to fetch exchange rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, from, to]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Currency Converter
      </h1>

      {/* Amount */}
      <label className="block mb-1 font-medium">Amount</label>
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* From */}
      <label className="block mb-1 font-medium">From</label>
      <select
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {currencyMap[c].flag} {currencyMap[c].name}
          </option>
        ))}
      </select>

      {/* Swap */}
      <div className="text-center my-3">
        <button
          onClick={swapCurrencies}
          className="px-4 py-1 border rounded hover:bg-gray-100"
        >
          ↔️ Swap
        </button>
      </div>

      {/* To */}
      <label className="block mb-1 font-medium">To</label>
      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {currencyMap[c].flag} {currencyMap[c].name}
          </option>
        ))}
      </select>

      {/* Result */}
      {loading && <p className="text-center">Converting…</p>}

      {result && !error && (
        <p className="mt-4 text-center text-lg font-semibold">
          {currencyMap[from].flag} {amount} {from.toUpperCase()} ={" "}
          {currencyMap[to].flag} {result} {to.toUpperCase()}
        </p>
      )}

      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </div>
  );
}
