"use client";
import { useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

export default function Home() {
  // Use string states for inputs to allow clearing
  const [loanStr, setLoanStr] = useState("1000000");
  const [interestStr, setInterestStr] = useState("8.5");
  const [tenureStr, setTenureStr] = useState("20");
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const tableRef = useRef(null);

  // Derived numeric values
  const loanAmount = loanStr === "" ? 0 : Number(loanStr);
  const interestRate = interestStr === "" ? 0 : Number(interestStr);
  const tenure = tenureStr === "" ? 0 : Number(tenureStr);

  // EMI Calculation
  const principal = loanAmount;
  const rate = interestRate / 100;
  const months = tenure * 12;
  const emi =
    months === 0
      ? 0
      : (((principal * rate) / 12) * Math.pow(1 + rate / 12, months)) /
        (Math.pow(1 + rate / 12, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  const data = [
    { name: "Principal", value: principal },
    { name: "Interest", value: totalInterest },
  ];
  const COLORS = ["url(#principalGradient)", "url(#interestGradient)"];

  // EMI Schedule
  const schedule = Array.from({ length: months }).map((_, i) => {
    const interestForMonth = ((principal - i * emi) * rate) / 12;
    const principalForMonth = emi - interestForMonth;
    const balance = principal - principalForMonth * (i + 1);
    return {
      month: i + 1,
      emi: emi,
      principal: principalForMonth,
      interest: interestForMonth,
      balance: balance > 0 ? balance : 0,
    };
  });

  const yearlyData = Array.from({ length: tenure }).map((_, i) => ({
    year: i + 1,
    months: schedule.slice(i * 12, (i + 1) * 12),
  }));

  const copyToClipboard = () => {
    const text = `Loan EMI: ₹${emi.toFixed(
      0
    )}\nTotal Payment: ₹${totalPayment.toFixed(
      0
    )}\nTotal Interest: ₹${totalInterest.toFixed(0)}`;
    navigator.clipboard.writeText(text);
    alert("EMI copied to clipboard!");
  };

  return (
    <>
      <Head>
        <title>Premium EMI Calculator India | Home & Personal Loan EMI</title>
        <meta
          name="description"
          content="Calculate your loan EMI instantly. Compare tenures, prepayment savings & visualize monthly payments with charts. Free EMI Calculator for India."
        />
        <meta
          name="keywords"
          content="EMI Calculator, Loan EMI, Home Loan EMI, Personal Loan EMI, India EMI Calculator"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="Premium EMI Calculator India" />
        <meta
          property="og:description"
          content="Calculate EMI, compare tenures & see prepayment savings."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/thumbnail.png"
        />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Premium EMI Calculator",
              "url": "https://yourdomain.com",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "description": "Calculate loan EMI, compare tenures, and view prepayment savings for loans in India."
            }
          `}
        </script>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black flex flex-col items-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 tracking-tight">
          EMI Calculator
        </h1>

        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10">
          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl space-y-10">
            {/* Loan Amount */}
            <div>
              <label className="block text-gray-300 font-medium mb-3 text-lg">
                Loan Amount (₹)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={10000}
                  value={loanStr || 0}
                  onChange={(e) => setLoanStr(e.target.value)}
                  className="flex-1 h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 accent-white"
                />
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={loanStr}
                  onChange={(e) => setLoanStr(e.target.value)}
                  className="w-36 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-indigo-200 font-semibold text-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-gray-300 font-medium mb-3 text-lg">
                Interest Rate (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.1}
                  value={interestStr || 0}
                  onChange={(e) => setInterestStr(e.target.value)}
                  className="flex-1 h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-emerald-400 to-cyan-400 accent-white"
                />
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={interestStr}
                  onChange={(e) => setInterestStr(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-emerald-200 font-semibold text-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-gray-300 font-medium mb-3 text-lg">
                Loan Tenure (Years)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={tenureStr || 0}
                  onChange={(e) => setTenureStr(e.target.value)}
                  className="flex-1 h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-pink-400 to-rose-500 accent-white"
                />
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={tenureStr}
                  onChange={(e) => setTenureStr(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border border-white/20 bg-white/10 text-pink-200 font-semibold text-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl flex flex-col items-center justify-center sticky top-20">
            <motion.div
              key={emi}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full"
            >
              <h2 className="text-lg text-gray-400 mb-2">Monthly EMI</h2>
              <motion.p
                key={emi}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2"
              >
                ₹ {emi.toFixed(0).toLocaleString()}
              </motion.p>

              <p className="mt-4 text-gray-300 text-lg font-semibold">
                Total Payment:{" "}
                <span className="text-indigo-200">
                  ₹ {totalPayment.toFixed(0).toLocaleString()}
                </span>
              </p>

              {/* Mini Cards */}
              <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                <div className="bg-white/10 p-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
                  <p className="text-sm text-gray-400">Principal</p>
                  <p className="text-lg font-bold text-indigo-200">
                    ₹ {principal.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-indigo-300 font-semibold">
                    {((principal / totalPayment) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
                  <p className="text-sm text-gray-400">Interest</p>
                  <p className="text-lg font-bold text-rose-300">
                    ₹ {totalInterest.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-rose-400 font-semibold">
                    {((totalInterest / totalPayment) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-cyan-500 rounded-xl text-white hover:bg-cyan-600 transition"
                >
                  Copy EMI Details
                </button>
              </div>

              {/* Donut Chart */}
              <div className="mt-10 w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient
                        id="principalGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366F1"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.9}
                        />
                      </linearGradient>
                      <linearGradient
                        id="interestGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F59E0B"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F43F5E"
                          stopOpacity={0.9}
                        />
                      </linearGradient>
                    </defs>

                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                      label={false}
                      paddingAngle={2}
                      isAnimationActive={true}
                    >
                      {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>

                    <Tooltip
                      cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                      labelStyle={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      itemStyle={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                      formatter={(value, name) => {
                        const numericValue = Number(value) || 0;
                        return [
                          `₹ ${new Intl.NumberFormat("en-IN", {
                            maximumFractionDigits: 0,
                          }).format(numericValue)}`,
                          `${name} (${(
                            (numericValue / totalPayment) *
                            100
                          ).toFixed(1)}%)`,
                        ];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* EMI Table */}
        <div
          id="emi-table"
          ref={tableRef}
          className="w-full max-w-6xl mt-10 overflow-x-auto"
        >
          <h3 className="text-xl font-bold text-gray-200 mb-4">EMI Schedule</h3>
          <div className="space-y-4">
            {yearlyData.map((yearData) => (
              <div
                key={yearData.year}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() =>
                    setExpandedYear(
                      expandedYear === yearData.year ? null : yearData.year
                    )
                  }
                >
                  <span className="font-semibold text-gray-200 text-lg">
                    Year {yearData.year}
                  </span>
                  <span className="text-indigo-300 font-bold text-lg">
                    ₹{" "}
                    {yearData.months
                      .reduce((sum, m) => sum + m.emi, 0)
                      .toLocaleString("en-IN")}
                  </span>
                </div>

                <AnimatePresence>
                  {expandedYear === yearData.year && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <table className="min-w-full text-gray-200">
                        <thead className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white">
                          <tr>
                            <th className="p-3 text-left">Month</th>
                            <th className="p-3 text-left">EMI (₹)</th>
                            <th className="p-3 text-left">Principal (₹)</th>
                            <th className="p-3 text-left">Interest (₹)</th>
                            <th className="p-3 text-left">Balance (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearData.months.map((month) => (
                            <tr
                              key={month.month}
                              className="border-b border-white/20 hover:bg-white/10 transition-colors"
                            >
                              <td className="p-3">{month.month}</td>
                              <td className="p-3">
                                ₹ {month.emi.toFixed(0).toLocaleString()}
                              </td>
                              <td className="p-3 text-indigo-200">
                                ₹ {month.principal.toFixed(0).toLocaleString()}
                              </td>
                              <td className="p-3 text-rose-300">
                                ₹ {month.interest.toFixed(0).toLocaleString()}
                              </td>
                              <td className="p-3 text-gray-300">
                                ₹ {month.balance.toFixed(0).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
