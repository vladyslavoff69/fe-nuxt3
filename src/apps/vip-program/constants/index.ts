export const VIP_TREATMENT_DATA = [
  {
    title: 'Rank Up Bonus',
    description: 'Unlock exclusive rewards as you climb the VIP ranks.',
    image: '1c23520f-fe3d-4b1c-a48b-637de2d66f00/sm',
    tooltip: '',
    key: 'rankUpBonus',
  },
  {
    title: 'Rakeback',
    description: 'Get a percentage of your bets back, win or lose.',
    image: 'c3b1793a-8c80-4204-31d2-47eecf682300/sm',
    tooltip: '',
    key: 'rakeback',
  },
  {
    title: 'Weekly Bonus',
    description: 'Enjoy a nice bonus each week based on wagering performance.',
    image: '08ba725f-35c8-41df-f3a4-8ac550dc0a00/sm',
    tooltip: 'Estimates for In-house Wagering & Slots <br> are shown in below VIP REWARDS Table',
    key: 'weeklyBonus',
  },
  {
    title: 'Daily Drip Bonus',
    description: 'Enjoy a steady stream of rewards every day.',
    image: '6a8e8534-8ff5-4489-4c8e-0545aceef900/sm',
    tooltip: 'Estimates for In-house Wagering & Slots <br> are shown in below VIP REWARDS Table',
    key: 'dailyDripBonus',
  },
]

export const VIP_COLORS: {
  [key in string]: string;
} = {
  UNRANKED: 'text-paragraph',
  'WOOD 1': 'text-vip-wood',
  'WOOD 2': 'text-vip-wood',
  'WOOD 3': 'text-vip-wood',
  'SILVER 1': 'text-vip-silver',
  'SILVER 2': 'text-vip-silver',
  'SILVER 3': 'text-vip-silver',
  'GOLD 1': 'text-vip-gold',
  'GOLD 2': 'text-vip-gold',
  'GOLD 3': 'text-vip-gold',
  'PLATINUM 1': 'text-vip-platinum',
  'PLATINUM 2': 'text-vip-platinum',
  'PLATINUM 3': 'text-vip-platinum',
  'DIAMOND 1': 'text-vip-diamond',
  'DIAMOND 2': 'text-vip-diamond',
  'DIAMOND 3': 'text-vip-diamond',
  'OBSIDIAN 1': 'text-highlights',
  'OBSIDIAN 2': 'text-highlights',
  'OBSIDIAN 3': 'text-highlights',
}

export const VIP_LEVELS_SLIDER_DATA = [
  {
    name: 'WOOD',
    color: 'text-vip-wood',
    image: '27d459c8-1b29-4d7b-79b0-3017568e1900/sm',
    levels: [
      {
        levelName: 'WOOD 1',
      },
      {
        levelName: 'WOOD 2',
      },
      {
        levelName: 'WOOD 3',
      },
    ],
    tooltips: [
      null, null, null,
    ]
  },
  {
    name: 'SILVER',
    color: 'text-vip-silver',
    image: 'd01d4b48-47ef-443f-0958-68ac41178200/sm',
    levels: [
      {
        levelName: 'SILVER 1',
      },
      {
        levelName: 'SILVER 2',
      },
      {
        levelName: 'SILVER 3',
      },
    ],
    tooltips: [
      null, null, null,
    ]
  },
  {
    name: 'GOLD',
    color: 'text-vip-gold',
    image: 'a5869011-80cf-4e5d-951b-604b8b1ce400/sm',
    levels: [
      {
        levelName: 'GOLD 1',
      },
      {
        levelName: 'GOLD 2',
      },
      {
        levelName: 'GOLD 3',
      },
    ],
    tooltips: [
      null, null, null,
    ]
  },
  {
    name: 'PLATINUM',
    color: 'text-vip-platinum',
    image: 'bb02aa77-1a5b-4520-46d4-bf2bde79af00/sm',
    levels: [
      {
        levelName: 'PLATINUM 1',
      },
      {
        levelName: 'PLATINUM 2',
      },
      {
        levelName: 'PLATINUM 3',
      },
    ],
    tooltips: [
      null, null, null,
    ]
  },
  {
    name: 'DIAMOND',
    color: 'text-vip-diamond',
    image: '015f50cd-61c7-4879-75cd-25f8b1296200/sm',
    levels: [
      {
        levelName: 'DIAMOND 1',
      },
      {
        levelName: 'DIAMOND 2',
      },
      {
        levelName: 'DIAMOND 3',
      },
    ],
    tooltips: [
      null, null, null,
    ],
  },
  {
    name: 'OBSIDIAN',
    color: 'text-highlights',
    image: '9574ec31-1594-4f73-52f3-0ebbf616cd00/sm',
    levels: [
      {
        levelName: 'OBSIDIAN 1',
      },
      {
        levelName: 'OBSIDIAN 2',
      },
      {
        levelName: 'OBSIDIAN 3',
      },
    ],
    tooltips: [
      null, null, null,
    ],
  },
]
