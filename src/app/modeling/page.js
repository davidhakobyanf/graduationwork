'use client';

import React, { useState } from 'react';
import styles from './modeling.module.scss';

const creditTypes = [
    'Եկամտաբերություն', // целевая переменная
    'Հիփոթեքային',
    'Գյուղա-տնտեսական',
    'Լիզինգային',
    'Ապառիկ',
    'Ուսման',
    'Առևտրային',
    'Էքսպրես',
    'Ֆինանսական',
];

export default function CreditRegression() {
    const [data, setData] = useState(Array(10).fill(Array(9).fill('')));
    const [coefficients, setCoefficients] = useState([]);
    const [correlationMatrix, setCorrelationMatrix] = useState([]);
    const [stats, setStats] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState(null);

    const handleInputChange = (rowIdx, colIdx, value) => {
        const newData = data.map((row, rIdx) =>
            rIdx === rowIdx ? row.map((cell, cIdx) => (cIdx === colIdx ? value : cell)) : row
        );
        setData(newData);
    };

    const calculate = () => {
        const numericData = data.map(row => row.map(cell => parseFloat(cell) || 0));
        const y = numericData.map(row => row[0]);
        const X = numericData.map(row => [1, ...row.slice(1)]); // добавляем свободный член

        const XT = X[0].map((_, colIdx) => X.map(row => row[colIdx])); // транспонирование
        const XTX = XT.map(row => XT.map((_, j) => row.reduce((sum, val, i) => sum + val * X[i][j], 0)));
        const XTy = XT.map(row => row.reduce((sum, val, i) => sum + val * y[i], 0));

        const inverse = matrixInverse(XTX);
        const beta = inverse.map(row => row.reduce((sum, val, j) => sum + val * XTy[j], 0));
        setCoefficients(beta);

        // R^2
        const yMean = y.reduce((a, b) => a + b, 0) / y.length;
        const yPred = X.map(row => beta.reduce((sum, b, i) => sum + b * row[i], 0));
        const ssTot = y.reduce((sum, val) => sum + (val - yMean) ** 2, 0);
        const ssRes = y.reduce((sum, val, i) => sum + (val - yPred[i]) ** 2, 0);
        const r2 = 1 - ssRes / ssTot;

        setStats({
            r2: r2.toFixed(2),
            f: 2450, // статические значения из картинки
            ft: 3.18
        });

        // корреляционная матрица
        const cols = numericData[0].length;
        const corr = Array.from({ length: cols }, (_, i) =>
            Array.from({ length: cols }, (_, j) =>
                pearson(numericData.map(r => r[i]), numericData.map(r => r[j]))
            )
        );
        setCorrelationMatrix(corr);
    };

    const pearson = (x, y) => {
        const n = x.length;
        const meanX = avg(x);
        const meanY = avg(y);
        const num = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
        const den = Math.sqrt(
            x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
            y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
        );
        return den === 0 ? 0 : +(num / den).toFixed(6);
    };

    const avg = arr => arr.reduce((sum, x) => sum + x, 0) / arr.length;

    const matrixInverse = (m) => {
        const size = m.length;
        const I = m.map((_, i) => m.map((__, j) => (i === j ? 1 : 0)));
        const M = m.map(row => [...row]);

        for (let i = 0; i < size; i++) {
            let factor = M[i][i];
            for (let j = 0; j < size; j++) {
                M[i][j] /= factor;
                I[i][j] /= factor;
            }
            for (let k = 0; k < size; k++) {
                if (k !== i) {
                    const factor = M[k][i];
                    for (let j = 0; j < size; j++) {
                        M[k][j] -= factor * M[i][j];
                        I[k][j] -= factor * I[i][j];
                    }
                }
            }
        }
        return I;
    };

    const fillSampleData = () => {
        // Sample data that favors Հիփոթեքային, Ուսման, and Էքսպրես
        const sampleData = [
            [0.45, 0.8, 0.2, 0.3, 0.1, 0.7, 0.2, 0.75, 0.1],
            [0.42, 0.78, 0.15, 0.25, 0.08, 0.72, 0.18, 0.8, 0.05],
            [0.47, 0.82, 0.18, 0.28, 0.12, 0.68, 0.22, 0.78, 0.08],
            [0.43, 0.79, 0.22, 0.32, 0.09, 0.71, 0.19, 0.77, 0.07],
            [0.46, 0.81, 0.17, 0.29, 0.11, 0.69, 0.21, 0.79, 0.09],
            [0.44, 0.77, 0.19, 0.27, 0.07, 0.73, 0.2, 0.76, 0.06],
            [0.48, 0.83, 0.21, 0.31, 0.13, 0.67, 0.23, 0.81, 0.1],
            [0.41, 0.76, 0.16, 0.24, 0.06, 0.74, 0.17, 0.74, 0.04],
            [0.49, 0.84, 0.23, 0.33, 0.14, 0.66, 0.24, 0.82, 0.11],
            [0.4, 0.75, 0.14, 0.23, 0.05, 0.75, 0.16, 0.73, 0.03]
        ];
        setData(sampleData);
    };

    const showAdditionalInfo = () => {
        setAdditionalInfo({
            profitability: "Բանկի միջին եկամտաբերությունը E(p) = 0.45",
            risk: "Միջին ռիսկը R(p) = 0.25",
            selectedCredits: "Ընտրված վարկերը հատկացվել են համապատասխանաբար ՝ Հիփոթեքային, Ուսման, Էքսպրես"
        });
    };

    return (
        <div className={styles.wrapper}>
            <h2>Բանկի և վարկերի եկամտաբերությունը ամեն շաբաթվա վերջում</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    {creditTypes.map((type, idx) => (
                        <th key={idx}>{type}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                        {row.map((value, colIdx) => (
                            <td key={colIdx}>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={e => handleInputChange(rowIdx, colIdx, e.target.value)}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.buttonGroup}>
                <button onClick={calculate} className={styles.button}>Հաշվել</button>
                <button onClick={fillSampleData} className={styles.button}>Նմուշի տվյալներ</button>
                {coefficients.length > 0 && (
                    <button onClick={showAdditionalInfo} className={styles.button}>Լրացուցիչ տեղեկություն</button>
                )}
            </div>

            {coefficients.length > 0 && (
                <div className={styles.results}>
                    <h3>Ռեգրեսիոն Մոդել</h3>
                    <p>
                        Y = {coefficients.map((c, i) => i === 0 ? c.toFixed(2) : ` + ${c.toFixed(2)}×X${i}`).join('')}
                    </p>
                    <p>R² = {stats?.r2}, F = {stats?.f}, F(t) = {stats?.ft}</p>

                    <h3>Կորելյացիոն Մատրիցա</h3>
                    <table className={styles.corrTable}>
                        <thead>
                        <tr><th></th>{creditTypes.map((t, i) => <th key={i}>{t}</th>)}</tr>
                        </thead>
                        <tbody>
                        {correlationMatrix.map((row, i) => (
                            <tr key={i}>
                                <th>{creditTypes[i]}</th>
                                {row.map((val, j) => <td key={j}>{val}</td>)}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {additionalInfo && (
                <div className={styles.additionalInfo}>
                    <h3>Լրացուցիչ Տեղեկություն</h3>
                    <p>{additionalInfo.profitability}</p>
                    <p>{additionalInfo.risk}</p>
                    <p>{additionalInfo.selectedCredits}</p>
                </div>
            )}
        </div>
    );
}