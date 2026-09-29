import Rich from './Rich.jsx'
import ChartExample from './ChartExample.jsx'
import { WIDGETS } from './widgets/index.js'

export default function LessonContent({ blocks }) {
  return blocks.map((b, i) => {
    switch (b.t) {
      case 'p': return <p key={i}><Rich text={b.x} /></p>
      case 'h': return <h3 key={i}>{b.x}</h3>
      case 'ul': return <ul key={i}>{b.items.map((x, j) => <li key={j}><Rich text={x} /></li>)}</ul>
      case 'ol': return <ol key={i}>{b.items.map((x, j) => <li key={j}><Rich text={x} /></li>)}</ol>
      case 'tip': return <aside key={i} className="callout tip"><span className="callout-icon" aria-hidden>💡</span><div><b>Consejo</b><p><Rich text={b.x} /></p></div></aside>
      case 'warn': return <aside key={i} className="callout warn"><span className="callout-icon" aria-hidden>⚠️</span><div><b>Cuidado</b><p><Rich text={b.x} /></p></div></aside>
      case 'ex': return <aside key={i} className="callout ex"><span className="callout-icon" aria-hidden>📊</span><div><b>{b.title}</b><p><Rich text={b.x} /></p></div></aside>
      case 'f': return <div key={i} className="formula mono">{b.x}</div>
      case 'table': return (
        <div key={i} className="table-wrap">
          <table><thead><tr>{b.head.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Rich text={c} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      )
      case 'chart': return <ChartExample key={i} spec={b.spec} />
      case 'w': { const W = WIDGETS[b.name]; return W ? <W key={i} /> : null }
      default: return null
    }
  })
}
