import React from "react";
import type { AssetPosition, FinanceRole } from "~/lib/finance/data";
import { Button } from "../ui/button";

const MARKET_LOOKUP: Array<{
  code: string;
  name: string;
  type: string;
  sector: string;
  currency: string;
  market: string;
}> = [
  {
    code: "AAPL",
    name: "Apple",
    type: "股票",
    sector: "科技",
    currency: "USD",
    market: "美股",
  },
  {
    code: "0700",
    name: "腾讯控股",
    type: "股票",
    sector: "互联网",
    currency: "HKD",
    market: "港股",
  },
  {
    code: "7203",
    name: "丰田汽车",
    type: "股票",
    sector: "工业",
    currency: "JPY",
    market: "日股",
  },
  {
    code: "MSFT",
    name: "微软",
    type: "股票",
    sector: "科技",
    currency: "USD",
    market: "美股",
  },
  {
    code: "BTC",
    name: "比特币",
    type: "加密",
    sector: "数字资产",
    currency: "USD",
    market: "加密",
  },
];

const ROLE_OPTIONS: FinanceRole[] = ["core", "defense", "offense"];

const ROLE_LABELS: Record<FinanceRole, string> = {
  core: "核心仓",
  defense: "防守仓",
  offense: "进攻仓",
  custom: "自定义",
};

type HoldingImporterProps = {
  onAdd: (asset: AssetPosition) => void;
  defaultCurrency?: string;
  buttonLabel?: string;
};

export function HoldingImporter({
  onAdd,
  defaultCurrency = "CNY",
  buttonLabel = "新增持仓",
}: HoldingImporterProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedLookup, setSelectedLookup] = React.useState<
    (typeof MARKET_LOOKUP)[number] | null
  >(null);
  const [codeInput, setCodeInput] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [role, setRole] = React.useState<FinanceRole>("core");
  const [message, setMessage] = React.useState("");

  const suggestions = React.useMemo(() => {
    if (!codeInput.trim()) return [];
    const term = codeInput.trim().toUpperCase();
    return MARKET_LOOKUP.filter(
      (item) => item.code.startsWith(term) || item.name.includes(term),
    );
  }, [codeInput]);

  const inferredMarket = React.useMemo(() => {
    if (selectedLookup) {
      return selectedLookup.market;
    }
    if (codeInput.endsWith(".HK")) {
      return "港股";
    }
    if (codeInput.endsWith(".US")) {
      return "美股";
    }
    if (codeInput.endsWith(".JP")) {
      return "日股";
    }
    return undefined;
  }, [codeInput, selectedLookup]);

  const handleConfirm = () => {
    const asset: AssetPosition = {
      name: (selectedLookup?.name ?? codeInput) || "自定义标的",
      code: selectedLookup?.code ?? codeInput,
      type: selectedLookup?.type ?? "股票",
      role,
      limit: 0,
      amount,
      currency: selectedLookup?.currency ?? defaultCurrency,
      sector: selectedLookup?.sector ?? inferredMarket ?? "其他",
    };
    if (!asset.code) {
      setMessage("请输入标的代码");
      return;
    }
    onAdd(asset);
    setMessage("已加入，可在持仓明细中查看");
    setCodeInput("");
    setAmount(0);
    setSelectedLookup(null);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <h3 className="font-semibold text-lg">新增持仓</h3>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">代码</span>
                <input
                  className="rounded-xl border border-border px-3 py-2"
                  value={codeInput}
                  onChange={(event) => {
                    setCodeInput(event.target.value.toUpperCase());
                    setSelectedLookup(null);
                  }}
                  placeholder="请输入代码（如 AAPL）"
                />
              </label>
              <div className="space-y-1">
                {suggestions.slice(0, 4).map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2 text-foreground text-xs hover:bg-muted/40"
                    onClick={() => {
                      setCodeInput(item.code);
                      setSelectedLookup(item);
                    }}
                  >
                    <span>
                      {item.name} · {item.code}
                    </span>
                    <span className="text-muted-foreground">{item.market}</span>
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">角色</span>
                  <select
                    className="rounded-xl border border-border px-3 py-2"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as FinanceRole)
                    }
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {ROLE_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">数量</span>
                  <input
                    type="number"
                    className="rounded-xl border border-border px-3 py-2"
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                </label>
              </div>
              <p className="text-muted-foreground text-xs">
                识别市场：{inferredMarket ?? "未知"} ·
                {selectedLookup ? ` ${selectedLookup.type}` : ""}
              </p>
            </div>
            {message && (
              <p className="mt-2 text-muted-foreground text-xs">{message}</p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-sm text-white"
              >
                确认新增
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
