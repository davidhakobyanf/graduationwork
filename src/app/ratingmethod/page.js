"use client";
import { useState } from "react";
import styles from "./ratingmethod.module.scss";

const criteriaNames = [
    "Դրամարկղ",
    "Հաշվարկային հաշիվ",
    "Արտարժութային հաշիվ",
    "Այլ դրամական միջոցներ",
    "Կարճաժամկետ ֆինանսական ներդրումներ",
    "Դեբիտորական պարտք",
    "Ծախսեր և պահուստ",
    "Կարճաժամկետ պարտավորություններ",
    "Սեփական միջոցների աղբյուրներ",
    "Հաշվեկշռի ընդհանուր արժեք",
];

export default function FinancialIndicators() {
    const [values, setValues] = useState({});
    const [results, setResults] = useState(null);

    const handleChange = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
    };

    const calculateIndicators = () => {
        const ds = criteriaNames.slice(0, 4).reduce((sum, key) => sum + (values[key] || 0), 0);
        const kfl = values[criteriaNames[4]] || 0;
        const dz = values["Դեբիտորական պարտք"] || 0;
        const zz = values["Ծախսեր և պահուստ"] || 0;
        const oxs = values["Կարճաժամկետ պարտավորություններ"] || 1;
        const ownCapital = values["Սեփական միջոցների աղբյուրներ"] || 0;
        const totalBalance = values["Հաշվեկշռի ընդհանուր արժեք"] || 1;

        const kal = (ds + kfl) / oxs;
        const kpl = (ds + kfl + dz) / oxs;
        const kp = (ds + kfl + dz + zz) / oxs;
        const kn = (ownCapital / totalBalance) * 100;

        const determineClass = (val, ranges) => {
            for (let i = 0; i < ranges.length; i++) {
                const [min, max, klass] = ranges[i];
                if (val >= min && val < max) return klass;
            }
            return val >= ranges[ranges.length - 1][1] ? ranges[ranges.length - 1][2] : null;
        };

        const kalClass = determineClass(kal, [
            [0.15, 0.2, 2],
            [0.2, Infinity, 1],
            [-Infinity, 0.15, 3],
        ]);
        const kplClass = determineClass(kpl, [
            [0.5, 0.8, 2],
            [0.8, Infinity, 1],
            [-Infinity, 0.5, 3],
        ]);
        const kpClass = determineClass(kp, [
            [1, 2, 2],
            [2, Infinity, 1],
            [-Infinity, 1, 3],
        ]);
        const knClass = determineClass(kn, [
            [40, 60, 2],
            [60, Infinity, 1],
            [-Infinity, 40, 3],
        ]);

        const rating = 30 * kalClass + 20 * kplClass + 30 * kpClass + 20 * knClass;

        let group = null;
        if (rating >= 100 && rating <= 150) group = 1;
        else if (rating >= 151 && rating <= 250) group = 2;
        else if (rating >= 251 && rating <= 300) group = 3;

        setResults({ kal, kpl, kp, kn, kalClass, kplClass, kpClass, knClass, rating, group });
    };

    const getClassName = (klass) => {
        return klass === 1 ? styles.classOne : klass === 2 ? styles.classTwo : styles.classThree;
    };

    return (
        <div className={styles.container}>
            <h1>Ֆինանսական ցուցանիշների գնահատում</h1>
            <div className={styles.ratingTable}>
                <h3>Ցուցանիշների դասակարգման աղյուսակ</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Ցուցանիշ</th>
                        <th>Դաս 1<br/>(Բարձր)</th>
                        <th>Դաս 2<br/>(Միջին)</th>
                        <th>Դաս 3<br/>(Ցածր)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Կալ (кал)</td>
                        <td>≥ 0.2</td>
                        <td>0.15 – 0.2</td>
                        <td>&lt; 0.15</td>
                    </tr>
                    <tr>
                        <td>Կպլ (кпл)</td>
                        <td>≥ 0.8</td>
                        <td>0.5 – 0.8</td>
                        <td>&lt; 0.5</td>
                    </tr>
                    <tr>
                        <td>Կպ (кп)</td>
                        <td>≥ 2</td>
                        <td>1 – 2</td>
                        <td>&lt; 1</td>
                    </tr>
                    <tr>
                        <td>Կն (кн)</td>
                        <td>≥ 60%</td>
                        <td>40% – 60%</td>
                        <td>&lt; 40%</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.form}>
                {criteriaNames.map((name) => (
                    <div key={name} className={styles.inputGroup}>
                        <label>{name}</label>
                        <input type="number" onChange={(e) => handleChange(name, e.target.value)}/>
                    </div>
                ))}
                <button className={styles.calcButton} onClick={calculateIndicators}>Հաշվել</button>
            </div>

            {results && (
                <div className={styles.results}>
                    <h2>Արդյունքներ</h2>
                    <div className={styles.resultRow}>
                        <span>Кал: {results.kal.toFixed(2)}</span>
                        <span className={getClassName(results.kalClass)}>Դաս {results.kalClass}</span>
                    </div>
                    <div className={styles.resultRow}>
                        <span>Кпл: {results.kpl.toFixed(2)}</span>
                        <span className={getClassName(results.kplClass)}>Դաս {results.kplClass}</span>
                    </div>
                    <div className={styles.resultRow}>
                        <span>Кп: {results.kp.toFixed(2)}</span>
                        <span className={getClassName(results.kpClass)}>Դաս {results.kpClass}</span>
                    </div>
                    <div className={styles.resultRow}>
                        <span>Кн: {results.kn.toFixed(2)}%</span>
                        <span className={getClassName(results.knClass)}>Դաս {results.knClass}</span>
                    </div>
                    <div className={styles.summary}>
                        <p>Ռեյտինգ՝ <strong>{results.rating}</strong></p>
                        <p className={styles.groupLabel}>Խումբը՝ <span
                            className={getClassName(results.group)}>Դաս {results.group}</span></p>
                    </div>
                </div>
            )}

            <div className={styles.legend}>
                <h3>Դասերի բացատրություն</h3>
                <ul>
                    <li className={styles.classOne}>1 Դաս – Բարձր վարկարժանություն</li>
                    <li className={styles.classTwo}>2 Դաս – Միջին վարկարժանություն</li>
                    <li className={styles.classThree}>3 Դաս – Ցածր վարկարժանություն</li>
                </ul>
            </div>
        </div>
    );
}
