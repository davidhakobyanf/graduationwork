"use client"
import { useState } from 'react';
import Head from 'next/head';
import styles from './Scoring.module.scss';

const questions = [
    {
        id: 1,
        title: "Հաճախորդի զբաղվածության աստիճանը",
        options: [
            { label: "մենեջեր", value: 10 },
            { label: "որակյալ բանվոր", value: 8 },
            { label: "գործակալ", value: 7 },
            { label: "ուսանող", value: 5 },
            { label: "ոչ որակյալ բանվոր", value: 4 },
            { label: "ոչ լրիվ աշխատանքային օր", value: 2 }
        ]
    },
    {
        id: 2,
        title: "Բնակարանով ապահովվածությունը",
        options: [
            { label: "սեփական տուն", value: 6 },
            { label: "վարձակալած տուն", value: 4 },
            { label: "ընկերոջ կամ բարեկամի մոտ է ապրում", value: 2 }
        ]
    },
    {
        id: 3,
        title: "Վարկային ռեյտինգը",
        options: [
            { label: "գերազանց", value: 10 },
            { label: "միջին", value: 5 },
            { label: "ինֆորմացիա չկա", value: 2 },
            { label: "վատ", value: 0 }
        ]
    },
    {
        id: 4,
        title: "Աշխատանքի տևողությունը",
        options: [
            { label: "1 տարուց ավելի", value: 5 },
            { label: "1 տարուց պակաս", value: 2 }
        ]
    },
    {
        id: 5,
        title: "Տվյալ հասցեով ապրելը",
        options: [
            { label: "1 տարուց ավելի", value: 2 },
            { label: "1 տարուց պակաս", value: 1 }
        ]
    },
    {
        id: 6,
        title: "Հեռախոսի առկայությունը",
        options: [
            { label: "կա", value: 2 },
            { label: "չկա", value: 0 }
        ]
    },
    {
        id: 7,
        title: "Խնամքի տակ անձանց թիվը",
        options: [
            { label: "չկա", value: 3 },
            { label: "1 անձ", value: 3 },
            { label: "2 անձ", value: 4 },
            { label: "3 անձ", value: 4 },
            { label: "3 - ից ավելի", value: 2 }
        ]
    },
    {
        id: 8,
        title: "Բանկային հաշվի առկայությունը",
        options: [
            { label: "չեկային և խնայողական հաշիվ", value: 4 },
            { label: "միայն խնայողական հաշիվ", value: 3 },
            { label: "միայն չեկային հաշիվ", value: 2 },
            { label: "չկա", value: 0 }
        ]
    }
];

const scoringMethods = [
    {
        id: 'a',
        label: 'ա) վարկունակության գնահատումը 29-43 բալանոց համակարգով։',
        ranges: [
            { min: 29, max: 30, amount: '500$' },
            { min: 31, max: 33, amount: '1000$' },
            { min: 34, max: 36, amount: '2500$' },
            { min: 37, max: 38, amount: '3500$' },
            { min: 39, max: 40, amount: '5000$' },
            { min: 41, max: 43, amount: '8000$' }
        ]
    },
    {
        id: 'b',
        label: 'բ) վարկունակության գնահատումը 410-610 բալանոց համակարգով։',
        ranges: [
            { min: 410, max: 430, amount: '500$' },
            { min: 431, max: 470, amount: '1000$' },
            { min: 471, max: 510, amount: '2500$' },
            { min: 511, max: 540, amount: '3500$' },
            { min: 541, max: 570, amount: '5000$' },
            { min: 571, max: 610, amount: '8000$' }
        ]
    }
];

export default function ScoringQuestionnaire() {
    const [answers, setAnswers] = useState({});
    const [method, setMethod] = useState(null);
    const [result, setResult] = useState(null);
    const [matrixData, setMatrixData] = useState({
        rows: 0,
        columns: 0,
        matrix: [],
        pMatrix: [],
        omega: [],
        pi: [],
        d: [],
        weights: []
    });

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
    };

    const calculateScore = () => {
        if (method === 'a') {
            const sum = Object.values(answers).reduce((acc, val) => acc + (val || 0), 0);
            const selectedMethod = scoringMethods.find(m => m.id === 'a');
            const range = selectedMethod.ranges.find(r => sum >= r.min && sum <= r.max);

            setResult({
                score: sum,
                creditAmount: range ? range.amount : "Վարկը մերժվում է!"
            });
        } else {
            calculateMatrixMethod();
        }
    };

    const calculateMatrixMethod = () => {
        // Calculate omega (column sums)
        const omega = matrixData.matrix[0].map((_, colIndex) =>
            matrixData.matrix.reduce((sum, row) => sum + (row[colIndex] || 0), 0)
        );

        // Calculate pi (pMatrix sums) and d (normalized)
        const pi = matrixData.pMatrix.map(row => row[0]);
        const sumPi = pi.reduce((a, b) => a + (b || 0), 0);
        const d = pi.map(value => value / (sumPi || 1));

        // Calculate weights
        // Сначала нормализуем матрицу
        const normalizedMatrix = matrixData.matrix.map(row =>
            row.map((value, colIndex) => {
                const omegaVal = omega[colIndex] || 1;
                return value / omegaVal;
            })
        );

// Теперь считаем веса
        const weights = normalizedMatrix.map((row, rowIndex) => {
            return row.reduce((sum, normVal, colIndex) => {
                const pVal = matrixData.pMatrix[colIndex][0] || 0;
                return sum + normVal * pVal;
            }, 0);
        });



        // Calculate final score
        const s = weights.reduce((sum, weight, index) => {
            return sum + ((answers[index + 1] || 0) * weight);
        }, 0);

        // Find credit amount
        const selectedMethod = scoringMethods.find(m => m.id === 'b');
        const range = selectedMethod.ranges.find(r => s >= r.min && s <= r.max);

        setMatrixData(prev => ({
            ...prev,
            omega,
            pi,
            d,
            weights
        }));

        setResult({
            score: s,
            creditAmount: range ? range.amount : "Վարկը մերժվում է!",
            omega,
            pi,
            d,
            weights
        });
    };

    const handleMatrixInput = (e) => {
        e.preventDefault();
        const rows = parseInt(e.target.rows.value);
        const columns = parseInt(e.target.columns.value);

        setMatrixData(prev => ({
            ...prev,
            rows,
            columns,
            matrix: Array(rows).fill().map(() => Array(columns).fill(0)),
            pMatrix: Array(columns).fill().map(() => Array(1).fill(0))
        }));
    };

    const handleMatrixValueChange = (row, col, value) => {
        const newMatrix = [...matrixData.matrix];
        newMatrix[row][col] = parseInt(value) || 0;
        setMatrixData(prev => ({ ...prev, matrix: newMatrix }));
    };

    const handlePMatrixValueChange = (col, value) => {
        const newPMatrix = [...matrixData.pMatrix];
        newPMatrix[col][0] = parseInt(value) || 0;
        setMatrixData(prev => ({ ...prev, pMatrix: newPMatrix }));
    };

    const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);
    const matrixReady = method !== 'b' || (matrixData.matrix.length > 0 && matrixData.rows > 0 && matrixData.columns > 0);

    return (
        <div className={styles.container}>
            <Head>
                <title>Սքորինգային հարցաշար</title>
                <meta name="description" content="Վարկունակության գնահատման համակարգ" />
            </Head>

            <h1 className={styles.title}>----------Սքորինգային հարցաշար----------</h1>

            <div className={styles.questionnaire}>
                {questions.map(question => (
                    <div key={question.id} className={styles.section}>
                        <h2>{question.id} | {question.title}</h2>
                        <div className={styles.options}>
                            {question.options.map((option, idx) => (
                                <label key={`q${question.id}-opt${idx}`}>
                                    <input
                                        type="radio"
                                        name={`q${question.id}`}
                                        value={option.value}
                                        onChange={() => handleAnswer(question.id, option.value)}
                                        checked={answers[question.id] === option.value}
                                    />
                                    {question.id}.{idx + 1}| {option.label} {option.value}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.methodSelection}>
                <h2>Ընտրեք գնահատման մեթոդը</h2>
                <div className={styles.options}>
                    {scoringMethods.map(methodItem => (
                        <label key={methodItem.id}>
                            <input
                                type="radio"
                                name="method"
                                value={methodItem.id}
                                onChange={() => setMethod(methodItem.id)}
                                checked={method === methodItem.id}
                            />
                            {methodItem.label}
                        </label>
                    ))}
                </div>
            </div>

            {method === 'b' && (
                <div className={styles.matrixInput}>
                    <h2>Մուտքագրեք մատրիցայի տվյալները</h2>
                    <form onSubmit={handleMatrixInput}>
                        <div>
                            <label>
                                Տողերի քանակը (k):
                                <input type="number" name="rows" min="1" required />
                            </label>
                        </div>
                        <div>
                            <label>
                                Սյուների քանակը (p):
                                <input type="number" name="columns" min="1" required />
                            </label>
                        </div>
                        <button type="submit">Հաստատել</button>
                    </form>

                    {matrixData.rows > 0 && matrixData.columns > 0 && (
                        <>
                            <h3>Մուտքագրեք մատրիցայի արժեքները</h3>
                            <div className={styles.matrixGrid}>
                                {matrixData.matrix.map((row, rowIndex) => (
                                    <div key={`row-${rowIndex}`} className={styles.matrixRow}>
                                        {row.map((_, colIndex) => (
                                            <input
                                                key={`cell-${rowIndex}-${colIndex}`}
                                                type="number"
                                                value={matrixData.matrix[rowIndex][colIndex]}
                                                onChange={(e) => handleMatrixValueChange(rowIndex, colIndex, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <h3>Մուտքագրեք P մատրիցայի արժեքները</h3>
                            <div className={styles.pMatrixGrid}>
                                {matrixData.pMatrix.map((row, colIndex) => (
                                    <div key={`p-row-${colIndex}`} className={styles.pMatrixRow}>
                                        <input
                                            type="number"
                                            value={matrixData.pMatrix[colIndex][0]}
                                            onChange={(e) => handlePMatrixValueChange(colIndex, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className={styles.calculateButton}>
                <button
                    onClick={calculateScore}
                    disabled={!allQuestionsAnswered || !method || !matrixReady}
                >
                    Հաշվել
                </button>
            </div>

            {result && (
                <div className={styles.result}>
                    <h2>Արդյունքներ</h2>
                    {method === 'a' ? (
                        <>
                            <p>Ընդհանուր գնահատական (բալեր): {result.score}</p>
                            <p>Վարկի առաջարկվող չափը: {result.creditAmount}</p>
                        </>
                    ) : (
                        <>
                            <h3>Քայլ 1. Օմեգա արժեքներ (սյուների գումար)</h3>
                            <p>Հաշվվում է մատրիցայի յուրաքանչյուր սյան արժեքների գումարը՝ նորմալացման համար։</p>
                            <p>{result.omega ? result.omega.join(', ') : "Օմեգա չկա"}</p>

                            <h3>Քայլ 2. Նորմալացված մատրիցա</h3>
                            <p>Յուրաքանչյուր արժեք բաժանվում է համապատասխան սյան ընդհանուր գումարի վրա՝ համեմատելի դարձնելու համար։</p>
                            <div className={styles.normalizedMatrix}>
                                {matrixData.matrix.map((row, rowIndex) => (
                                    <div key={`n-row-${rowIndex}`} className={styles.matrixRow}>
                                        {row.map((value, colIndex) => (
                                            <span key={`n-cell-${rowIndex}-${colIndex}`}>
                  {(value / (result.omega[colIndex] || 1)).toFixed(2)}
                </span>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <h3>Քայլ 3. Գումարված գնահատականներ (Pi)</h3>
                            <p>Յուրաքանչյուր տարբերակի նորմալացված արժեքների գումարը։</p>
                            <p>{result.pi.join(', ')} (Ընդհանուր = {result.pi.reduce((a, b) => a + b, 0)})</p>

                            <h3>Քայլ 4. Նորմալացված գնահատականներ (D)</h3>
                            <p>Pi արժեքները բաժանվում են իրենց ընդհանուր գումարի վրա՝ տոկոսային ներկայացման համար։</p>
                            <p>{result.d.map(v => v.toFixed(2)).join(', ')}</p>

                            <h3>Քայլ 5. Քաշային գործակիցներ (W)</h3>
                            <p>Արտահայտում է՝ որքան կարևոր է տվյալ չափանիշը՝ ընդհանուր գնահատականի համար։</p>
                            {result.weights.map((weight, index) => (
                                <p key={`weight-${index}`}>Չափանիշ {index + 1}-ի քաշային գործակիցը: W{index + 1} = {weight.toFixed(2)}</p>
                            ))}

                            <h3>Վերջնական արդյունք</h3>
                            <p>Ընդհանուր գնահատական S = {result.score.toFixed(2)} (հաշվվում է՝ D * W)</p>
                            <p>Առաջարկվող վարկի չափը: {result.creditAmount}</p>
                        </>
                    )}
                </div>
            )}

        </div>
    );
}