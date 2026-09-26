import { type EventDefinition } from '../types/game';

export const EVENTS: EventDefinition[] = [
  {
    id: 'evt_bumper_harvest',
    title: 'Bumper Harvest',
    description: 'Perfect weather yields overflowing granaries across the countryside.',
    icon: 'Wheat',
    category: 'food',
    impactRanges: {
      food: { min: 15, max: 25 },
    },
  },
  {
    id: 'evt_harsh_drought',
    title: 'Summer Drought',
    description: 'Scorching heat dries rivers and wilts crops in the field.',
    icon: 'Sun',
    category: 'food',
    impactRanges: {
      food: { min: -25, max: -15 },
    },
  },
  {
    id: 'evt_peasant_migration',
    title: 'Refugee Surge',
    description: 'Families fleeing neighboring conflicts arrive seeking shelter.',
    icon: 'Users',
    category: 'population',
    impactRanges: {
      population: { min: 10, max: 18 },
      food: { min: -10, max: -5 },
    },
  },
  {
    id: 'evt_winter_fever',
    title: 'Outbreak of Fever',
    description: 'A sickness sweeps through crowded settlements.',
    icon: 'Skull',
    category: 'population',
    impactRanges: {
      population: { min: -15, max: -8 },
    },
  },
  {
    id: 'evt_merchant_caravan',
    title: 'Foreign Traders',
    description: 'Wealthy merchant caravans pay handsome tariffs to trade in city plazas.',
    icon: 'Coins',
    category: 'gold',
    impactRanges: {
      gold: { min: 15, max: 25 },
    },
  },
  {
    id: 'evt_bandit_raid',
    title: 'Highway Banditry',
    description: 'Outlaws ambush royal supply wagons along major roads.',
    icon: 'Swords',
    category: 'gold',
    impactRanges: {
      gold: { min: -20, max: -10 },
      food: { min: -10, max: -5 },
    },
  },
  {
    id: 'evt_grain_rot',
    title: 'Granary Mold',
    description: 'Damp storage conditions spoil reserved wheat barrels.',
    icon: 'AlertTriangle',
    category: 'food',
    impactRanges: {
      food: { min: -20, max: -12 },
    },
  },
  {
    id: 'evt_noble_donation',
    title: 'Aristocratic Gift',
    description: 'A wealthy lord donates gold to secure favor with the crown.',
    icon: 'Gift',
    category: 'gold',
    impactRanges: {
      gold: { min: 12, max: 22 },
    },
  },
  {
    id: 'evt_locust_swarm',
    title: 'Locust Plague',
    description: 'Swarms consume grain crops just weeks before the harvest.',
    icon: 'Bug',
    category: 'food',
    impactRanges: {
      food: { min: -22, max: -14 },
    },
  },
  {
    id: 'evt_royal_birth',
    title: 'Royal Celebration',
    description: 'Celebrations boost trade and attract visitors from nearby regions.',
    icon: 'Crown',
    category: 'population',
    impactRanges: {
      population: { min: 5, max: 10 },
      gold: { min: 5, max: 12 },
    },
  },
  {
    id: 'evt_tax_strike',
    title: 'Merchant Dispute',
    description: 'Guildmasters withhold regular dues over high toll tariffs.',
    icon: 'Scroll',
    category: 'gold',
    impactRanges: {
      gold: { min: -18, max: -10 },
    },
  },
  {
    id: 'evt_fertile_soil',
    title: 'Silt Deposit',
    description: 'River flooding leaves nutrient-rich soil in low-lying pastures.',
    icon: 'Sprout',
    category: 'food',
    impactRanges: {
      food: { min: 10, max: 18 },
    },
  },
  {
    id: 'evt_town_fire',
    title: 'District Blaze',
    description: 'Fire consumes wooden tenement housing, displacing citizens.',
    icon: 'Flame',
    category: 'population',
    impactRanges: {
      population: { min: -12, max: -6 },
      gold: { min: -10, max: -5 },
    },
  },
  {
    id: 'evt_maritime_wreck',
    title: 'Cargo Shipwreck',
    description: 'A storm destroys incoming merchant ships carrying grain and coins.',
    icon: 'Anchor',
    category: 'gold',
    impactRanges: {
      gold: { min: -15, max: -8 },
      food: { min: -12, max: -6 },
    },
  },
  {
    id: 'evt_settler_boom',
    title: 'Frontier Migration',
    description: 'News of prosperous lands draws ambitious homesteaders.',
    icon: 'UserPlus',
    category: 'population',
    impactRanges: {
      population: { min: 8, max: 15 },
    },
  },
  {
    id: 'evt_counterfeit_coins',
    title: 'Forged Coinage',
    description: 'Debased metal coins undermine market transactions.',
    icon: 'TrendingDown',
    category: 'gold',
    impactRanges: {
      gold: { min: -16, max: -8 },
    },
  },
];