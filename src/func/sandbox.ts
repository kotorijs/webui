export type Role = 'member' | 'admin' | 'owner';

export interface User {
  id: number;
  name: string;
  sex: 'male' | 'female' | 'unknown';
  age: number;
  qq?: number;
  groups: [number, Role][];
  users: number[];
}

export interface Group {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  scopeId: number;
  type: 'group' | 'private';
  message: string;
  user: number;
  date: number;
}

export interface Sandbox {
  users: User[];
  groups: Group[];
  message: Message[];
  current: number;
  currentScopeId?: number;
  address: string;
  bot: number;
}

export function spawnId() {
  const str = (Math.random() * 10 ** 9).toFixed();
  return Number(str) + Number(str.at(1) ?? 0) + Number(str.at(2) ?? 0) + Number(str.at(3) ?? 0);
}
