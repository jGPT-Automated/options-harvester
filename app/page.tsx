"use client";

import React, { useState, useEffect } from "react";
import TickerSearch from "@/components/TickerSearch";
import ExpirySelect from "@/components/ExpirySelect";
import OptionChainTable from "@/components/OptionChainTable";
import TradeIdeaInputs from "@/components/TradeIdeaInputs";
import PremiumComparison from "@/components/PremiumComparison";
import ChatSidebar from "@/components/ChatSidebar";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";
import { OptionContract } from "@/lib/types";

export default function HomePage() {
  const [symbol, setSymbol] = useState("");
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const [contracts, setContracts] = useState<OptionContract[]>([]);
  const [premiums, setPremiums] = useState<
    { expiry: string; strike: number; premium: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handler for when the user submits a ticker symbol. Fetches the list
   * of expiries and sets the first expiry as selected.
   */
  const handleSearch = async (sym: string) => {
    setSymbol(sym);
    setExpiries([]);
    setSelectedExpiry("");
    setContracts([]);
    setPremiums([]);
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/options/${sym}/expiries`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch expiries");
      setExpiries(data.expiries);
      if (data.expiries && data.expiries.length > 0) {
        setSelectedExpiry(data.expiries[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch the options chain whenever the selected symbol or expiry changes.
   */
  useEffect(() => {
    const fetchChain = async () => {
      if (!symbol || !selectedExpiry) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/options/${symbol}?expiry=${encodeURIComponent(selectedExpiry)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch chain");
        setContracts(data.contracts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChain();
  }, [symbol, selectedExpiry]);

  /**
   * Handler for comparing premiums across expiries based on a trade idea.
   * Calls the premiums API and stores results in state.
   */
  const handleCompare = async (direction: string, targetPrice: number) => {
    if (!symbol || expiries.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/options/${symbol}/premiums?direction=${direction}&targetPrice=${targetPrice}&expiries=${expiries.join(",")}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to compute premiums");
      setPremiums(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Options Harvester</h1>
        <TickerSearch onSubmit={handleSearch} />
        {expiries.length > 0 && (
          <ExpirySelect
            expiries={expiries}
            selected={selectedExpiry}
            onSelect={setSelectedExpiry}
          />
        )}
        {expiries.length > 0 && <TradeIdeaInputs onSubmit={handleCompare} />}
        {loading && <Loading />}
        <ErrorState message={error} />
        {contracts.length > 0 && <OptionChainTable contracts={contracts} />}
        <PremiumComparison results={premiums} />
      </main>
      {/* Chat sidebar displayed on larger screens */}
      <aside className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l">
        <ChatSidebar />
      </aside>
    </div>
  );
}
