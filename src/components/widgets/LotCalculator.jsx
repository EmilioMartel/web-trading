import { useState } from 'react'
import { NumberField, Segmented, Stat } from '../Field.jsx'
import { fmt, money } from '../../utils.js'

// Valor del pip (o punto) por 1 lote, en USD
const INSTR = {
  usd: { label: 'Forex …/USD', hint: 'EUR/USD, GBP/USD, AUD/USD, NZD/USD · 1 pip = 0,0001 · 1 lote = 10 $/pip', unit: 'pips' },
  jpy: { label: 'Forex …/JPY', hint: 'USD/JPY, EUR/JPY, GBP/JPY · 1 pip = 0,01 · el valor depende del precio del USD/JPY', unit: 'pips' },
  xau: { label: 'Oro XAU/USD', hint: '1 lote = 100 onzas · 1 pip = 0,10 $ de precio (ej. 2.350,00 → 2.350,10) · 1 lote = 10 $/pip', unit: 'pips' },
  idx: { label: 'Índices', hint: 'NAS100, US30, US500, GER40 · el valor por punto depende del contrato de tu broker', unit: 'puntos' },
}

export default function LotCalculator() {
  const [inst, setInst] = useState('xau')
  const [cur, setCur] = useState('USD')
  const [balance, setBalance] = useState(5000)
  const [riskMode, setRiskMode] = useState('%')
  const [riskPct, setRiskPct] = useState(1)
  const [riskAmt, setRiskAmt] = useState(50)
  const [dist, setDist] = useState(50)
  const [jpy, setJpy] = useState(150)
  const [eurusd, setEurusd] = useState(1.1)
  const [ptVal, setPtVal] = useState(1)

  const n = (x) => (typeof x === 'number' && isFinite(x) ? x : 0)
  const sym = cur === 'EUR' ? '€' : '$'

  // Valor de 1 pip por 1 lote en USD
  let pipUSD = 10
  if (inst === 'jpy') pipUSD = n(jpy) > 0 ? 1000 / n(jpy) : 0
  if (inst === 'xau') pipUSD = 10 // 100 oz × 0,10 $
  const toAcc = (usd) => (cur === 'USD' ? usd : n(eurusd) > 0 ? usd / n(eurusd) : 0)
  // En índices el valor por punto se introduce ya en la divisa de la cuenta
  const perPip = inst === 'idx' ? n(ptVal) : toAcc(pipUSD)

  const riskMoney = riskMode === '%' ? (n(balance) * n(riskPct)) / 100 : n(riskAmt)
  const riskPctReal = n(balance) > 0 ? (riskMoney / n(balance)) * 100 : 0
  const rawLots = n(dist) > 0 && perPip > 0 ? riskMoney / (n(dist) * perPip) : 0
  const lots = Math.floor(rawLots * 100 + 1e-9) / 100
  const realRisk = lots * n(dist) * perPip
  const unitWord = inst === 'idx' ? 'punto' : 'pip'

  return (
    <div className="widget calc">
      <div className="widget-head"><span className="widget-tag">Calculadora</span><h4>Tamaño de posición</h4></div>
      <Segmented options={Object.entries(INSTR).map(([value, o]) => ({ value, label: o.label }))} value={inst} onChange={setInst} label="Instrumento" />
      <p className="muted small">{INSTR[inst].hint}</p>
      <div className="form-grid">
        <label className="field">
          <span className="field-label">Divisa de la cuenta</span>
          <Segmented options={['USD', 'EUR']} value={cur} onChange={setCur} label="Divisa" />
        </label>
        <NumberField label="Saldo de la cuenta" value={balance} onChange={setBalance} suffix={sym} />
        <label className="field">
          <span className="field-label">Riesgo por operación en…</span>
          <Segmented options={[{ value: '%', label: '% de la cuenta' }, { value: 'amt', label: `Importe (${sym})` }]} value={riskMode} onChange={setRiskMode} label="Tipo de riesgo" />
        </label>
        {riskMode === '%'
          ? <NumberField label="Riesgo" value={riskPct} onChange={setRiskPct} step={0.1} suffix="%" />
          : <NumberField label="Riesgo" value={riskAmt} onChange={setRiskAmt} step={1} suffix={sym} />}
        <NumberField label={`Distancia al stop (${INSTR[inst].unit})`} value={dist} onChange={setDist} step={1} suffix={INSTR[inst].unit} />
        {inst === 'jpy' && <NumberField label="Precio actual USD/JPY" value={jpy} onChange={setJpy} step={0.01} />}
        {inst === 'idx' && <NumberField label={`Valor por punto y lote (${sym})`} value={ptVal} onChange={setPtVal} step={0.1} suffix={sym} />}
        {cur === 'EUR' && inst !== 'idx' && <NumberField label="Tipo EUR/USD" value={eurusd} onChange={setEurusd} step={0.0001} />}
      </div>
      {inst === 'xau' && n(dist) > 0 && (
        <p className="muted small">{fmt(n(dist), 0)} pips = <b>{fmt(n(dist) * 0.1, 2)} $</b> de movimiento del precio del oro.</p>
      )}
      <div className="stat-grid">
        <Stat label="Dinero en riesgo" value={`${money(riskMoney, cur)}${riskMode === 'amt' ? ` (${fmt(riskPctReal)} %)` : ''}`} tone="down" />
        <Stat label="Tamaño recomendado" value={`${fmt(lots)} lotes`} tone="accent" />
        <Stat label={`Valor por ${unitWord} con ${fmt(lots)} lotes`} value={money(lots * perPip, cur)} />
        <Stat label="Riesgo real (redondeado)" value={money(realRisk, cur)} />
      </div>
      <div className="table-wrap">
        <table className="mini-table">
          <thead><tr><th>Lotes</th><th>0,01</th><th>0,10</th><th>1,00</th></tr></thead>
          <tbody><tr><td>Por {unitWord}</td>{[0.01, 0.1, 1].map((l) => <td key={l} className="mono">{money(l * perPip, cur)}</td>)}</tr></tbody>
        </table>
      </div>
      {lots === 0 && riskMoney > 0 && <p className="note warn-note">El riesgo es demasiado pequeño para ese stop incluso con 0,01 lotes. Aumenta el riesgo o reduce la distancia del stop.</p>}
      <p className="muted small">
        Cálculo orientativo con contratos estándar. {cur === 'EUR' && inst !== 'idx' ? 'El valor del pip de estos instrumentos está en dólares: en una cuenta en euros se convierte con el tipo EUR/USD (10 $ ≈ ' + money(toAcc(10), 'EUR') + '). ' : ''}Comprueba siempre el tamaño de contrato en la especificación del símbolo de tu broker (MT5: clic derecho en el símbolo → Especificación).
      </p>
    </div>
  )
}
