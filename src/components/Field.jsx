export function Slider({ label, value, onChange, min, max, step = 1, suffix = '', format }) {
  return (
    <label className="field slider">
      <span className="field-top">
        <span>{label}</span>
        <b className="mono">{format ? format(value) : value}{suffix}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  )
}

export function NumberField({ label, value, onChange, step = 'any', suffix, min = 0 }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="input-wrap">
        <input type="number" inputMode="decimal" value={value} step={step} min={min}
          onChange={(e) => onChange(e.target.value === '' ? '' : parseFloat(e.target.value))} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
    </label>
  )
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const l = typeof o === 'string' ? o : o.label
        return (
          <button key={v} role="tab" aria-selected={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
            {l}
          </button>
        )
      })}
    </div>
  )
}

export function Stat({ label, value, tone }) {
  return (
    <div className={`stat ${tone || ''}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value mono">{value}</span>
    </div>
  )
}
