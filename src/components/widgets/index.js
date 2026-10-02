import CandleWidget from './CandleWidget.jsx'
import StructureWidget from './StructureWidget.jsx'
import SessionsWidget from './SessionsWidget.jsx'
import MAWidget from './MAWidget.jsx'
import LotCalculator from './LotCalculator.jsx'
import MonteCarlo from './MonteCarlo.jsx'
import Compound from './Compound.jsx'
import { RiskUnitWidget, WinRateMatrix, PartialsWidget, ChecklistWidget } from './RiskWidgets.jsx'
import { PipValueWidget, RRWidget, DrawdownWidget, FibWidget } from './SmallWidgets.jsx'

export const WIDGETS = {
  candle: CandleWidget,
  structure: StructureWidget,
  sessions: SessionsWidget,
  ma: MAWidget,
  lotcalc: LotCalculator,
  montecarlo: MonteCarlo,
  compound: Compound,
  pipvalue: PipValueWidget,
  rr: RRWidget,
  drawdown: DrawdownWidget,
  fib: FibWidget,
  riskunit: RiskUnitWidget,
  matrix: WinRateMatrix,
  partials: PartialsWidget,
  checklist: ChecklistWidget,
}
