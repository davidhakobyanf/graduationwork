'use client'

import { useState, useMemo } from 'react'
import styles from './portfel.module.scss'

const Page = () => {
    const [data, setData] = useState([
        { S: 18, H: 20 }, { S: 20, H: 23 }, { S: 21, H: 19 }, { S: 14, H: 18 },
        { S: 16, H: 19 }, { S: 22, H: 20 }, { S: 16, H: 19 }, { S: 16, H: 18 },
        { S: 20, H: 20 }, { S: 16, H: 18 }, { S: 21, H: 16 }, { S: 14, H: 22 },
        { S: 17, H: 19 }, { S: 14, H: 14 }, { S: 16, H: 22 }, { S: 16, H: 17 },
        { S: 16, H: 18 }, { S: 18, H: 15 }, { S: 17, H: 18 }, { S: 21, H: 17 },
        { S: 20, H: 17 }, { S: 22, H: 24 }, { S: 14, H: 15 }, { S: 18, H: 18 },
        { S: 17, H: 19 }, { S: 26, H: 19 }, { S: 16, H: 20 }, { S: 19, H: 18 },
        { S: 15, H: 22 }, { S: 17, H: 24 }, { S: 15, H: 21 }, { S: 17, H: 21 },
        { S: 18, H: 21 }, { S: 16, H: 16 }, { S: 24, H: 21 }, { S: 18, H: 18 },
    ])

    const [weights, setWeights] = useState([
        { wS: 0.25, wH: 0.75 },
        { wS: 0.5, wH: 0.5 },
        { wS: 0.75, wH: 0.25 },
    ])

    const stats = useMemo(() => {
        const S = data.map(r => r.S)
        const H = data.map(r => r.H)
        const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length
        const variance = (arr, mean) => arr.map(x => (x - mean) ** 2)

        const Es = avg(S)
        const Eh = avg(H)
        const Vs = avg(variance(S, Es))
        const Vh = avg(variance(H, Eh))
        const Rs = Math.sqrt(Vs)
        const Rh = Math.sqrt(Vh)
        const Cov = avg(S.map((s, i) => (s - Es) * (H[i] - Eh)))
        const Corr = Cov / (Rs * Rh)

        const covMatrix = [
            [Vs, Cov],
            [Cov, Vh]
        ]

        const corrMatrix = [
            [1, Corr],
            [Corr, 1]
        ]

        const matrixETheta = [
            [Es, 0.4],
            [Eh, 0.6]
        ]

        const theta = [0.4, 0.6]

        const Ep = Es * theta[0] + Eh * theta[1]
        const Rp = Math.sqrt(
            theta[0] ** 2 * Vs +
            theta[1] ** 2 * Vh +
            2 * theta[0] * theta[1] * Cov
        )

        const scenarios = weights.map(({ wS, wH }) => {
            const Ep = Es * wS + Eh * wH
            const Rp = Math.sqrt(wS ** 2 * Vs + wH ** 2 * Vh + 2 * wS * wH * Cov)
            return { wS, wH, Ep, Rp }
        })

        return { Es, Eh, Rs, Rh, Vs, Vh, Cov, Corr, covMatrix, corrMatrix, matrixETheta, theta, Ep, Rp, scenarios }
    }, [data, weights])

    const updateField = (index, field, value) => {
        const copy = [...data]
        copy[index][field] = Number(value)
        setData(copy)
    }

    return (
        <div className={styles.wrapper}>
            <h1>📊 Portfolio Data</h1>
            <table>
                <thead>
                <tr><th>#</th><th>S</th><th>H</th></tr>
                </thead>
                <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td><input type="number" value={row.S} onChange={e => updateField(i, 'S', e.target.value)} /></td>
                        <td><input type="number" value={row.H} onChange={e => updateField(i, 'H', e.target.value)} /></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>📈 Portfolio Statistics</h2>
            <table>
                <tbody>
                <tr><td>Mean S</td><td>{stats.Es.toFixed(2)}</td></tr>
                <tr><td>Mean H</td><td>{stats.Eh.toFixed(2)}</td></tr>
                <tr><td>Variance S</td><td>{stats.Vs.toFixed(2)}</td></tr>
                <tr><td>Variance H</td><td>{stats.Vh.toFixed(2)}</td></tr>
                <tr><td>Std Dev S</td><td>{stats.Rs.toFixed(2)}</td></tr>
                <tr><td>Std Dev H</td><td>{stats.Rh.toFixed(2)}</td></tr>
                <tr><td>Covariance</td><td>{stats.Cov.toFixed(2)}</td></tr>
                <tr><td>Correlation</td><td>{stats.Corr.toFixed(2)}</td></tr>
                </tbody>
            </table>

            <h2>📉 Covariance Matrix</h2>
            <table>
                <thead><tr><th></th><th>S</th><th>H</th></tr></thead>
                <tbody>
                <tr><td>S</td><td>{stats.covMatrix[0][0].toFixed(2)}</td><td>{stats.covMatrix[0][1].toFixed(2)}</td></tr>
                <tr><td>H</td><td>{stats.covMatrix[1][0].toFixed(2)}</td><td>{stats.covMatrix[1][1].toFixed(2)}</td></tr>
                </tbody>
            </table>

            <h2>📉 Correlation Matrix</h2>
            <table>
                <thead><tr><th></th><th>S</th><th>H</th></tr></thead>
                <tbody>
                <tr><td>S</td><td>{stats.corrMatrix[0][0].toFixed(2)}</td><td>{stats.corrMatrix[0][1].toFixed(2)}</td></tr>
                <tr><td>H</td><td>{stats.corrMatrix[1][0].toFixed(2)}</td><td>{stats.corrMatrix[1][1].toFixed(2)}</td></tr>
                </tbody>
            </table>

            <h2>📘 Matrix E & Theta</h2>
            <table>
                <thead><tr><th></th><th>E</th><th>θ</th></tr></thead>
                <tbody>
                <tr><td>S</td><td>{stats.matrixETheta[0][0]}</td><td>{stats.matrixETheta[0][1]}</td></tr>
                <tr><td>H</td><td>{stats.matrixETheta[1][0]}</td><td>{stats.matrixETheta[1][1]}</td></tr>
                </tbody>
            </table>

            <h2>📘 Theta</h2>
            <table>
                <thead><tr><th>θ₁</th><th>θ₂</th></tr></thead>
                <tbody>
                <tr><td>{stats.theta[0]}</td><td>{stats.theta[1]}</td></tr>
                </tbody>
            </table>

            <h2>Եկամտի մաքսիմալացումը</h2>
            <p><b>Ep =</b> {stats.Ep.toFixed(6)}</p>
            <p><b>Rp =</b> {stats.Rp.toFixed(6)}</p>

            <h2>📊 Portfolio Scenarios (L11:N13)</h2>
            <table>
                <thead>
                <tr><th>wS</th><th>wH</th><th>Ep</th><th>Rp</th></tr>
                </thead>
                <tbody>
                {stats.scenarios.map((s, i) => (
                    <tr key={i}>
                        <td>{s.wS}</td>
                        <td>{s.wH}</td>
                        <td>{s.Ep.toFixed(2)}</td>
                        <td>{s.Rp.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Page;