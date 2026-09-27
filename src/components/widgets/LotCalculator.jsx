import { useState } from 'react'
import { NumberField, Segmented, Stat } from '../Field.jsx'
import { fmt, money } from '../../utils.js'

const INSTR = {
  usd: { label: 'Forex …/USD', hint: 'EUR/USD, GBP/USD, AUD/USD, NZD/USD', unit: 'pips' },
  jpy: { label: 'Forex …/JPY', hint: 'USD/JPY, EUR/JPY, GBP/JPY', unit: 'pips' },
  xau: { label: 'Oro XAU/USD', hint: '1 lote = 100 onzas', unit: '$ de precio' },
  idx: { label: 'Índices', hint: 'NAS100, US30, US500, GER40', unit: 'puntos' },
}

export default function LotCalculator() {
  const [inst, setInst] = useState('usd')
  const [cur, setCur] = useState('USD')
  const [balance, setBalance] = useState(5000)
  const [riskPct, setRiskPct] = useState(1)
  const [dist, setDist] = useState(20)
  const [jpy, setJpy] = useState(150)
  const [eurusd, setEurusd] = useState(1.1)
  const [ptVal, setPtVal] = useState(1)

  const n = (x) => (typeof x === 'number' && isFinite(x) ? x : 0)
  // valor (en USD) de 1 unidad de distancia por 1 lote
  let perUnitUSD = 10
  if (inst === 'jpy') perUnitUSD = n(jpy) > 0 ? 1000 / n(jpy) : 0
  if (inst === 'xau') perUnitUSD = 100
  if (inst === 'idx') perUnitUSD = n(ptVal)
  const toAcc = (usd) => (cur === 'USD' ? usd : n(eurusd) > 0 ? usd / n(eurusd) : 0)
  // En índices el valor por punto se introduce ya en la divisa de la cuenta
  const perUnit = inst === 'idx' ? n(ptVal) : toAcc(perUnitUSD)

  const riskMoney = (n(balance) * n(riskPct)) / 100
  const rawLots = n(dist) > 0 && perUnit > 0 ? riskMoney / (n(dist) * perUnit) : 0
  const lots = Math.floor(rawLots * 100) / 100
  const realRisk = lots * n(dist) * perUnit

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
        <NumberField label="Saldo de la cuenta" value={balance} onChange={setBalance} suffix={cur === 'EUR' ? '€' : '$'} />
        <NumberField label="Riesgo por operación" value={riskPct} onChange={setRiskPct} step={0.1} suffix="%" />
        <NumberField label={`Distancia al stop (${INSTR[inst].unit})`} value={dist} onChange={setDist} step={inst === 'xau' ? 0.1 : 1} />
        {inst === 'jpy' && <NumberField label="Precio actual USD/JPY" value={jpy} onChange={setJpy} step={0.01} />}
        {inst === 'idx' && <NumberField label={`Valor por punto y lote (${cur})`} value={ptVal} onChange={setPtVal} step={0.1} />}
        {cur === 'EUR' && inst !== 'idx' && <NumberField label="Tipo EUR/USD" value={eurusd} onChange={setEurusd} step={0.0001} />}
      </div>
      <div className="stat-grid">
        <Stat label="Dinero en riesgo" value={money(riskMoney, cur)} tone="down" />
        <Stat label="Tamaño recomendado" value={`${fmt(lots)} lotes`} tone="accent" />
        <Stat label={`Valor por ${inst === 'xau' ? '$' : inst === 'idx' ? 'punto' : 'pip'} (1 lote)`} value={money(perUnit, cur)} />
        <Stat label="Riesgo real (redondeado)" value={money(realRisk, cur)} />
      </div>
      {lots === 0 && riskMoney > 0 && <p className="note warn-note">El riesgo es demasiado pequeño para ese stop incluso con 0,01 lotes. Aumenta el saldo o reduce la distancia del stop.</p>}
      <p className="muted small">Cálculo orientativo. Comprueba siempre el tamaño de contrato y el valor del pip en las especificaciones de tu broker.</p>
    </div>
  )
}
