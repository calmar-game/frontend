import { Zap, Shield, Sword, Crown, Star } from 'lucide-react';

export enum CharacterClass {
  CYBER_SENTINEL = 'Cyber_Sentinel',
  NEON_STRIKER = 'Neon_Striker',
  QUANTUM_KNIGHT = 'Quantum_Knight',
  VOID_SOVEREIGN = 'Void_Sovereign',
  MATRIX_PIONEER = 'Matrix_Pioneer',
}  

export const GAME_AVATARS = [
  {
    id: CharacterClass["CYBER_SENTINEL"],
    name: 'Cyber Sentinel',
    icon: Shield,
    description: 'Guardian of digital realms',
    borderColor: '#00ffff',
    bgColor: '#00f15'
  },
  {
    id: CharacterClass["NEON_STRIKER"],
    name: 'Neon Striker',
    icon: Zap,
    description: 'Master of lightning speed',
    borderColor: '#ff00ff',
    bgColor: '#ff00ff15'
  },
  {
    id: CharacterClass['QUANTUM_KNIGHT'],
    name: 'Quantum Knight',
    icon: Sword,
    description: 'Warrior of parallel chains',
    borderColor: '#00ff00',
    bgColor: '#00ff0015'
  },
  {
    id: CharacterClass["VOID_SOVEREIGN"],
    name: 'Void Sovereign',
    icon: Crown,
    description: 'Ruler of digital space',
    borderColor: '#ff9900',
    bgColor: '#ff990015'
  },
  {
    id: CharacterClass["MATRIX_PIONEER"],
    name: 'Matrix Pioneer',
    icon: Star,
    description: 'Explorer of unknown protocols',
    borderColor: '#627eea',
    bgColor: '#627eea15'
  }
];
