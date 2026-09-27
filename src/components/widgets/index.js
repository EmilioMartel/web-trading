import { createElement } from 'react'
import CandleWidget from './CandleWidget.jsx'
import StructureWidget from './StructureWidget.jsx'
import SessionsWidget from './SessionsWidget.jsx'
import MAWidget from './MAWidget.jsx'
import LotCalculator from './LotCalculator.jsx'
import MonteCarlo from './MonteCarlo.jsx'
import Compound from './Compound.jsx'
import { PipValueWidget, RRWidget, DrawdownWidget, FibWidget } from './SmallWidgets.jsx'

export const WIDGETS = {
  candle: CandleWidget,
  structure: StructureWidget,
  choch: () => createElement(StructureWidget, { initial: 'Cambio (CHoCH)' }),
  sessions: SessionsWidget,
  ma: MAWidget,
  lotcalc: LotCalculator,
  montecarlo: MonteCarlo,
  compound: Compound,
  pipvalue: PipValueWidget,
  rr: RRWidget,
  drawdown: DrawdownWidget,
  fib: FibWidget,
}
