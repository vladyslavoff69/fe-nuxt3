import type { RiskShort, Row, Segment } from '~/apps/game/types'

export const FAIRNESS = Symbol('FAIRNESS') as InjectionKey<{
  gameSlug: Ref<string>;
  serverSeed: Ref<string>;
  clientSeed: Ref<string>;
  nonce: Ref<number>;
  mines: {
    minesCount: Ref<number>;
    minesOptions: { label: string, value: number }[]
  }
  dragonTower: {
    dragonTowerDifficulty: Ref<string>;
    dragonTowerDifficultyOptions: { label: string, value: string }[]
  }
  plinko: {
    maxBooster: Ref<'default' | 'left' | 'right'>;
    selectedRisk: Ref<RiskShort>;
    selectedRows: Ref<Row>;
  }
  wheel: {
    wheelRisk: Ref<RiskShort>;
    selectedSegment: Ref<Segment>;
  }
}>
