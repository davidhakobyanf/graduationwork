'use client'
import { useState } from 'react';
import styles from './credit.module.scss'

const CreditworthinessBySolvency = ({ onBack }) => {
    const [formData, setFormData] = useState({
        A_: '',
        P_: '',
        A: '',
        A12: '',
        A3: '',
        L1: '',
        L2: '',
        P1_L: '',
        P2: '',
        P: '',
        E: '',
        AM: '',
        R: '',
        ISG: '',
        shevs: '',
        HMF: '',
        Hark: '',
        BG: '',
        BSSH: ''
    });

    const [results, setResults] = useState(null);
    const [activeTab, setActiveTab] = useState('tab1');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateResults = () => {
        const {
            A_, P_, A, A12, A3, L1, L2, P1_L, P2, P, E, AM, R,
            ISG, shevs, HMF, Hark, BG, BSSH
        } = formData;

        // First block calculations
        const K11 = (parseInt(A_) - parseInt(P_)) / parseInt(A);
        const K12 = parseInt(A_) / parseInt(P_);
        const K13 = (parseInt(A12) + parseInt(A3)) / parseInt(P_);
        const K14 = parseInt(A12) / parseInt(P_);
        const K15 = 365 * parseInt(A12) / (parseInt(L1) + parseInt(L2));
        const K21 = parseInt(P1_L) / (parseInt(P1_L) + parseInt(P2));
        const K22 = parseInt(P1_L) / parseInt(P2);
        const K23 = (parseInt(P) - parseInt(P2)) / parseInt(P);
        const K24 = (parseInt(E) + parseInt(AM)) / parseInt(R);

        const K_aver1 = (K11 + K12 + K13 + K14 + K15 + K21 + K22 + K23 + K24) / 9;
        let K_das1 = 1;
        if (K_aver1 >= 26 && K_aver1 <= 50) K_das1 = 2;
        else if (K_aver1 >= 51 && K_aver1 <= 75) K_das1 = 3;
        else if (K_aver1 >= 76) K_das1 = 4;

        // Second block calculations
        const DSO = (1517 + 1153) / (2 * parseInt(ISG) / 360);
        const FATR = (2 * parseInt(ISG)) / parseInt(shevs);
        const TATR = (2 * parseInt(ISG)) / (1355 + 971);
        const PMM = parseInt(P) / parseInt(A);
        const TIE = parseInt(E) / parseInt(R);
        const FCC = (parseInt(E) + parseInt(P1_L)) / (parseInt(R) + parseInt(P1_L) + (parseInt(HMF) / (1 - 0)));
        const IASHG = (parseInt(E) - parseInt(Hark)) / parseInt(ISG);
        const ROA = (parseInt(E) - parseInt(Hark)) * 2 / (11582 + 9462);
        const ROE = (parseInt(E) - parseInt(Hark)) * 2 / (5147 + 4557);
        const PIE = parseFloat(BG) / parseFloat(BSSH);

        const Sec_Block_aver1 = (DSO + FATR + TATR + PMM + TIE + FCC + IASHG + ROA + ROE + PIE) / 10;
        let Sec_Block_das1 = 1;
        if (Sec_Block_aver1 >= 26 && Sec_Block_aver1 <= 50) Sec_Block_das1 = 2;
        else if (Sec_Block_aver1 >= 51 && Sec_Block_aver1 <= 75) Sec_Block_das1 = 3;
        else if (Sec_Block_aver1 >= 76) Sec_Block_das1 = 4;

        setResults({
            firstBlock: {
                K11: K11.toFixed(2),
                K12: K12.toFixed(2),
                K13: K13.toFixed(2),
                K14: K14.toFixed(2),
                K15: K15.toFixed(2),
                K21: K21.toFixed(2),
                K22: K22.toFixed(2),
                K23: K23.toFixed(2),
                K24: K24.toFixed(2),
                K_das1
            },
            secondBlock: {
                DSO: DSO.toFixed(2),
                FATR: FATR.toFixed(2),
                TATR: TATR.toFixed(2),
                PMM: PMM.toFixed(2),
                TIE: TIE.toFixed(2),
                FCC: FCC.toFixed(2),
                IASHG: IASHG.toFixed(2),
                ROA: ROA.toFixed(3),
                ROE: ROE.toFixed(2),
                PIE: PIE.toFixed(2),
                Sec_Block_das1
            }
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Վարկունակության գնահատում վճարունակության հիման վրա</h1>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'tab1' ? styles.active : ''}`}
                    onClick={() => setActiveTab('tab1')}
                >
                    Դաշտ 1
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'tab2' ? styles.active : ''}`}
                    onClick={() => setActiveTab('tab2')}
                >
                    Դաշտ 2
                </button>
            </div>

            <div className={styles.formContainer}>
                {activeTab === 'tab1' ? (
                    <>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել շրջանառու ակտիվները (A_):</label>
                            <input
                                type="number"
                                name="A_"
                                value={formData.A_}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել կարճաժամկետ պարտավորությունները (P_):</label>
                            <input
                                type="number"
                                name="P_"
                                value={formData.P_}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել ընդհանուր ակտիվները (A):</label>
                            <input
                                type="number"
                                name="A"
                                value={formData.A}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել դրամական միջոցները (A12):</label>
                            <input
                                type="number"
                                name="A12"
                                value={formData.A12}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել դեբիտորական պարտքը (A3):</label>
                            <input
                                type="number"
                                name="A3"
                                value={formData.A3}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել իրացված արտադրանքի ինքնարժեքը (L1):</label>
                            <input
                                type="number"
                                name="L1"
                                value={formData.L1}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել այլ ծախսերը (L2):</label>
                            <input
                                type="number"
                                name="L2"
                                value={formData.L2}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել երկարաժամկետ պարտքը և լիզինգի արժեքը (P1_L):</label>
                            <input
                                type="number"
                                name="P1_L"
                                value={formData.P1_L}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել սեփական կապիտալը (P2):</label>
                            <input
                                type="number"
                                name="P2"
                                value={formData.P2}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել ընդհանուր պարտավորությունները (P):</label>
                            <input
                                type="number"
                                name="P"
                                value={formData.P}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել եկամուտը նախքան տոկոսի և հարկերի վճարումը (E):</label>
                            <input
                                type="number"
                                name="E"
                                value={formData.E}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել ամորտիզացիան (AM):</label>
                            <input
                                type="number"
                                name="AM"
                                value={formData.AM}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել տոկոսը (R):</label>
                            <input
                                type="number"
                                name="R"
                                value={formData.R}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել իրացումից ստացված գումարը (ISG):</label>
                            <input
                                type="number"
                                name="ISG"
                                value={formData.ISG}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել շինությունների և սարքավորումների արժեքը (shevs):</label>
                            <input
                                type="number"
                                name="shevs"
                                value={formData.shevs}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել մարման փոխառու միջոցները (HMF):</label>
                            <input
                                type="number"
                                name="HMF"
                                value={formData.HMF}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել հարկի չափը (Hark):</label>
                            <input
                                type="number"
                                name="Hark"
                                value={formData.Hark}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել բաժնետոմսի գինը (BG):</label>
                            <input
                                type="number"
                                name="BG"
                                value={formData.BG}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ներմուծել բաժնետոմսին ընկնող շահույթը (BSSH):</label>
                            <input
                                type="number"
                                name="BSSH"
                                value={formData.BSSH}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className={styles.buttonGroup}>
                <button
                    onClick={calculateResults}
                    className={styles.calculateButton}
                >
                    Հաշվարկել արդյունքները
                </button>
                <button
                    onClick={onBack}
                    className={styles.backButton}
                >
                    Վերադառնալ
                </button>
            </div>

            {results && (
                <div className={styles.resultsContainer}>
                    <div className={styles.resultSection}>
                        <h2 className={styles.resultTitle}>Առաջին բլոկի արդյունքներ</h2>
                        <div className={styles.resultGrid}>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K11:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K11}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K12:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K12}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K13:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K13}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K14:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K14}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K15:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K15}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K21:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K21}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K22:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K22}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K23:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K23}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>K24:</span>
                                <span className={styles.resultValue}>{results.firstBlock.K24}</span>
                            </div>
                        </div>
                        <p className={styles.resultSummary}>
                            Ըստ իրացվելիության պատկանում է {results.firstBlock.K_das1} դասին
                        </p>
                    </div>

                    <div className={styles.resultSection}>
                        <h2 className={styles.resultTitle}>Երկրորդ բլոկի արդյունքներ</h2>
                        <div className={styles.resultGrid}>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>DSO:</span>
                                <span className={styles.resultValue}>{results.secondBlock.DSO}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>FATR:</span>
                                <span className={styles.resultValue}>{results.secondBlock.FATR}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>TATR:</span>
                                <span className={styles.resultValue}>{results.secondBlock.TATR}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>PMM:</span>
                                <span className={styles.resultValue}>{results.secondBlock.PMM}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>TIE:</span>
                                <span className={styles.resultValue}>{results.secondBlock.TIE}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>FCC:</span>
                                <span className={styles.resultValue}>{results.secondBlock.FCC}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>IASHG:</span>
                                <span className={styles.resultValue}>{results.secondBlock.IASHG}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>ROA:</span>
                                <span className={styles.resultValue}>{results.secondBlock.ROA}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>ROE:</span>
                                <span className={styles.resultValue}>{results.secondBlock.ROE}</span>
                            </div>
                            <div className={styles.resultItem}>
                                <span className={styles.resultLabel}>PIE:</span>
                                <span className={styles.resultValue}>{results.secondBlock.PIE}</span>
                            </div>
                        </div>
                        <p className={styles.resultSummary}>
                            Ըստ վճարունակության պատկանում է {results.secondBlock.Sec_Block_das1} դասին
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditworthinessBySolvency;