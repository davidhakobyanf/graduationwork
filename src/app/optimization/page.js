'use client';
import styles from './optimization.module.scss';
import { useState, useMemo } from 'react';

export default function PortfolioTable() {
    const [data, setData] = useState(
        Array.from({ length: 36 }, () => ({ S: '', H: '' }))
    );

    const handleChange = (index, field, value) => {
        const newData = [...data];
        newData[index][field] = value;
        setData(newData);
    };

    const fillRandom = () => {
        const randomData = data.map(() => ({
            S: Math.floor(Math.random() * 31),
            H: Math.floor(Math.random() * 31),
        }));
        setData(randomData);
    };

    const clearAll = () => {
        const clearedData = data.map(() => ({ S: '', H: '' }));
        setData(clearedData);
    };

    const calculateStandardDeviation = (values) => {
        const n = values.length;
        if (n === 0) return 0;
        const mean = values.reduce((acc, val) => acc + val, 0) / n;
        const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (n - 1);
        return Math.sqrt(variance);
    };

    const calculateCovariance = (x, y) => {
        const n = x.length;
        if (n === 0) return 0;
        const meanX = x.reduce((acc, val) => acc + val, 0) / n;
        const meanY = y.reduce((acc, val) => acc + val, 0) / n;
        return x.reduce((acc, val, i) => acc + (val - meanX) * (y[i] - meanY), 0) / (n - 1);
    };

    const statistics = useMemo(() => {
        const SValues = data.map(row => Number(row.S)).filter(val => !isNaN(val));
        const HValues = data.map(row => Number(row.H)).filter(val => !isNaN(val));

        const avgS = SValues.length ? (SValues.reduce((acc, val) => acc + val, 0) / SValues.length) : 0;
        const avgH = HValues.length ? (HValues.reduce((acc, val) => acc + val, 0) / HValues.length) : 0;

        const stdDevS = calculateStandardDeviation(SValues);
        const stdDevH = calculateStandardDeviation(HValues);

        const incomeRiskS = stdDevS !== 0 ? avgS / stdDevS : 0;
        const incomeRiskH = stdDevH !== 0 ? avgH / stdDevH : 0;

        const covarianceSH = calculateCovariance(SValues, HValues);

        const covarianceMatrix = {
            fields: ['S', 'H'],
            matrix: [
                [calculateCovariance(SValues, SValues), covarianceSH],
                [covarianceSH, calculateCovariance(HValues, HValues)]
            ]
        };

        const correlationMatrix = {
            fields: ['S', 'H'],
            matrix: [
                [
                    '1.00',
                    (stdDevS && stdDevH ? (covarianceSH / (stdDevS * stdDevH)).toFixed(2) : '0.00')
                ],
                [
                    (stdDevS && stdDevH ? (covarianceSH / (stdDevS * stdDevH)).toFixed(2) : '0.00'),
                    '1.00'
                ]
            ]
        };

        const weights = [0.4, 0.6];
        const Ep = avgS * weights[0] + avgH * weights[1];

        const cov = covarianceMatrix.matrix;
        const Rp = Math.sqrt(
            weights[0] * weights[0] * cov[0][0] +
            2 * weights[0] * weights[1] * cov[0][1] +
            weights[1] * weights[1] * cov[1][1]
        );

        return {
            avgS: avgS.toFixed(2),
            avgH: avgH.toFixed(2),
            stdDevS: stdDevS.toFixed(2),
            stdDevH: stdDevH.toFixed(2),
            incomeRiskS: incomeRiskS.toFixed(2),
            incomeRiskH: incomeRiskH.toFixed(2),
            covarianceMatrix: {
                ...covarianceMatrix,
                matrix: covarianceMatrix.matrix.map(row => row.map(val => val.toFixed(4)))
            },
            correlationMatrix,
            Ep: Ep.toFixed(4),
            Rp: Rp.toFixed(4),
        };
    }, [data]);

    return (
        <div className={styles['portfolio-container']}>
            <div className={styles['table-container']}>
                <h1 className={styles.title}>Պորտֆելային աղյուսակ</h1>

                <div className={styles['button-container']}>
                    <button onClick={fillRandom} className={`${styles.btn} ${styles['fill-btn']}`}>Սպասարկել պատահական տվյալներով</button>
                    <button onClick={clearAll} className={`${styles.btn} ${styles['clear-btn']}`}>Մաքրել բոլորը</button>
                </div>

                <div className={styles['table-responsive']}>
                    <table className={styles['main-table']}>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>S</th>
                            <th>H</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={row.S}
                                        onChange={(e) => handleChange(index, 'S', e.target.value)}
                                        className={styles['input-field']}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={row.H}
                                        onChange={(e) => handleChange(index, 'H', e.target.value)}
                                        className={styles['input-field']}
                                    />
                                </td>
                            </tr>
                        ))}

                        <tr className={styles['stat-row']}>
                            <td>Եկամտաբերություն</td>
                            <td>{statistics.avgS}</td>
                            <td>{statistics.avgH}</td>
                        </tr>
                        <tr className={styles['stat-row']}>
                            <td>Ռիսկ</td>
                            <td>{statistics.stdDevS}</td>
                            <td>{statistics.stdDevH}</td>
                        </tr>
                        <tr className={styles['stat-row']}>
                            <td>Եկամտաբերություն / ռիսկ</td>
                            <td>{statistics.incomeRiskS}</td>
                            <td>{statistics.incomeRiskH}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles['matrix-container']}>
                    <h2>Կովարիացիոն մատրիցա</h2>
                    <table className={styles['matrix-table']}>
                        <thead>
                        <tr>
                            <th></th>
                            {statistics.covarianceMatrix.fields.map(field => (
                                <th key={field}>{field}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {statistics.covarianceMatrix.fields.map((rowField, i) => (
                            <tr key={rowField}>
                                <td>{rowField}</td>
                                {statistics.covarianceMatrix.matrix[i].map((value, j) => (
                                    <td key={j}>{value}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <h2>Կոռելյացիոն մատրիցա</h2>
                    <table className={styles['matrix-table']}>
                        <thead>
                        <tr>
                            <th></th>
                            {statistics.correlationMatrix.fields.map(field => (
                                <th key={field}>{field}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {statistics.correlationMatrix.fields.map((rowField, i) => (
                            <tr key={rowField}>
                                <td>{rowField}</td>
                                {statistics.correlationMatrix.matrix[i].map((value, j) => (
                                    <td key={j}>{value}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles['result-container']}>
                    <p>📈 Պորտֆելի եկամտաբերություն (Ep): <span>{statistics.Ep}</span></p>
                    <p>⚠️ Պորտֆելի ռիսկ (Rp): <span>{statistics.Rp}</span></p>
                </div>
            </div>
        </div>
    );
}