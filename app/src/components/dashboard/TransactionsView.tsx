"use client";
import { useState, useMemo } from "react";
import { mockTransactions } from "@/lib/mock-data";
import { formatINR, formatDate, CATEGORY_COLORS } from "@/lib/design-tokens";
import { Search, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

const CATEGORIES = ["All", "Entertainment", "Food", "Income", "Utilities", "Health", "Transport", "Subscriptions"];

export function TransactionsView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState<"all" | "credit" | "debit">("all");

  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || tx.category === category;
      const matchType = type === "all" || tx.type === type;
      return matchSearch && matchCategory && matchType;
    });
  }, [search, category, type]);

  const totalCredit = filtered.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit  = filtered.filter(t => t.type === "debit" ).reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount (INR)"];
    const rows = filtered.map(tx => [
      tx.date,
      `"${tx.description}"`,
      tx.category,
      tx.type === "credit" ? "Income" : "Expense",
      tx.type === "credit" ? `+${tx.amount}` : `-${tx.amount}`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `subspace-transactions-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 page-enter">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Money In",  value: totalCredit,              color: "text-green-600" },
          { label: "Money Out", value: totalDebit,               color: "text-red-500"   },
          { label: "Net",       value: totalCredit - totalDebit, color: totalCredit > totalDebit ? "text-green-600" : "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4">
            <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{s.label}</p>
            <p style={{ fontFamily: "'Instrument Serif', serif" }} className={`text-[24px] tracking-tight ${s.color}`}>
              {formatINR(Math.abs(s.value))}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#F5EFE7] border-0 rounded-xl outline-none placeholder:text-[#9CA3AF] text-[#121212] focus:ring-2 focus:ring-teal-400/30"
              aria-label="Search transactions"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["all", "credit", "debit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                  type === t ? "bg-teal-500 text-white" : "bg-[#F5EFE7] text-[#6B6B6B] hover:bg-[#EDE8DF]"
                }`}
              >
                {t === "all" ? "All" : t === "credit" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                category === cat ? "bg-[#121212] text-white" : "bg-[#F5EFE7] text-[#6B6B6B] hover:bg-[#EDE8DF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5EFE7]">
          <p className="text-[13px] text-[#6B6B6B]">{filtered.length} transactions</p>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-teal-500 hover:text-teal-600 active:scale-95 transition-all"
            aria-label="Download transactions as CSV"
          >
            <Download size={13} aria-hidden="true" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Transaction history">
            <thead>
              <tr className="border-b border-[#F5EFE7]">
                {["Description", "Category", "Date", "Amount"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="border-b border-[#F9F7F4] last:border-0 hover:bg-[#FDFAF7] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <BrandLogo
                        logoUrl={tx.logoUrl}
                        name={tx.description}
                        color={CATEGORY_COLORS[tx.category as keyof typeof CATEGORY_COLORS] || "#9CA3AF"}
                        size="sm"
                      />
                      <span className="text-[13px] font-semibold text-[#121212]">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5EFE7] text-[#6B6B6B]">{tx.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#9CA3AF]">{formatDate(tx.date)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {tx.type === "credit"
                        ? <ArrowDownLeft size={13} className="text-green-500" aria-hidden="true" />
                        : <ArrowUpRight  size={13} className="text-red-400"   aria-hidden="true" />
                      }
                      <span className={`text-[13px] font-bold ${tx.type === "credit" ? "text-green-600" : "text-[#121212]"}`}>
                        {tx.type === "credit" ? "+" : "-"}{formatINR(tx.amount)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[15px] font-semibold text-[#121212] mb-1">No transactions found</p>
              <p className="text-[13px] text-[#9CA3AF]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
