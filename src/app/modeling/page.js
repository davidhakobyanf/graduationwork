// app/components/FinancialCalculator.jsx
"use client";

import { useState } from "react";
import { create, all } from "mathjs";

const math = create(all);

const ROWS = 37;
const COLS = 30;
const defaultTable = Array.from({ length: ROWS }, (_, i) =>
    Array.from({ length: COLS }, (_, j) => (i + 1) * (j + 1))
);

const FinancialCalculator = () => {
    const [table, setTable] = useState(defaultTable);
    const [results, setResults] = useState(null);

    const handleChange = (row, col, value) => {
        const newTable = [...table];
        newTable[row][col] = parseFloat(value) || 0;
        setTable(newTable);
    };

    const get = (cell) => {
        const col = cell.charCodeAt(0) - 65;
        const row = parseInt(cell.slice(1), 10) - 1;
        return table[row]?.[col] || 0;
    };

    const calculate = () => {
        try {
            const K3_K8 = table.slice(2, 8).map(row => row[10]);
            const L2 = K3_K8;

            const Z2_AC5 = table.slice(1, 5).map(row => row.slice(25, 29));
            const AF2 = math.inv(Z2_AC5);

            const AH2 = get("AH2");
            const AH4 = get("AH4");
            const AJ2 = Math.pow(AH2, 2) / (AF2[0][2] * AH4);
            const AK2 = 1 - (1 / AF2[0][0]);

            const L9 = Math.pow(get("L2"), 2);
            const M9 = Math.pow(get("M2"), 2);
            const N9 = Math.pow(get("N2"), 2);
            const O9 = Math.pow(get("O2"), 2);
            const P9 = Math.pow(get("P2"), 2);
            const Q9 = Math.pow(get("Q2"), 2);

            const S9 = Math.max(L9, M9, N9, O9, P9, Q9);

            const Z9_AC12 = table.slice(8, 12).map(row => row.slice(25, 29));
            const AF9 = math.inv(Z9_AC12);
            const AH9 = get("AH9");
            const AH11 = get("AH11");
            const AJ9 = Math.pow(AH9, 2) / (AF9[0][2] * AH11);

            const M12 = (S9 * 34) / (1 - S9);

            setResults({
                L2,
                AF2,
                AJ2: +AJ2.toFixed(3),
                AK2: +AK2.toFixed(3),
                S9: +S9.toFixed(3),
                AF9,
                AJ9: +AJ9.toFixed(3),
                M12: +M12.toFixed(3)
            });
        } catch (err) {
            setResults({ error: err.message });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Ֆինանսական հաշվիչ</h1>

            <div className="overflow-auto border rounded-md mb-4">
                <table className="table-auto border-collapse w-full">
                    <thead>
                    <tr>
                        {Array.from({ length: COLS }).map((_, j) => (
                            <th key={j} className="border px-2 py-1 bg-gray-100">{String.fromCharCode(65 + j)}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {table.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j} className="border p-1">
                                    <input
                                        type="number"
                                        value={cell}
                                        onChange={(e) => handleChange(i, j, e.target.value)}
                                        className="w-full p-1 border rounded text-sm"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button onClick={calculate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Հաշվել
            </button>

            {results && (
                <div className="mt-6 space-y-2">
                    {results.error ? (
                        <p className="text-red-600 font-semibold">Սխալ: {results.error}</p>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold">Արդյունքներ</h2>
                            <p><strong>L2:</strong> {JSON.stringify(results.L2)}</p>
                            <p><strong>AF2 (INV Z2:AC5):</strong> {JSON.stringify(results.AF2)}</p>
                            <p><strong>AJ2:</strong> {results.AJ2}</p>
                            <p><strong>AK2:</strong> {results.AK2}</p>
                            <p><strong>S9:</strong> {results.S9}</p>
                            <p><strong>AF9 (INV Z9:AC12):</strong> {JSON.stringify(results.AF9)}</p>
                            <p><strong>AJ9:</strong> {results.AJ9}</p>
                            <p><strong>M12:</strong> {results.M12}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FinancialCalculator;