import { ILevelDefinition } from '../../types/level';

export const chapter7Levels: ILevelDefinition[] = [
  // ─── 7.1: Class Members ───────────────────────────────────────────────────
  {
    id: '7.1',
    chapter: 7,
    levelInChapter: 1,
    title: 'Arquitetura de Drone',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#class-members',
      section: 'Class Members'
    },
    mission: {
      briefing: `O TS suporta classes do ES2015, mas adiciona anotações de tipo para propriedades e métodos. Você deve instanciar o 'BatteryManager' para monitorar o drone.\n\nLembre-se: campos de classe devem ser inicializados ou marcados como opcionais.`,
      objective: "Use a classe 'BatteryManager' para verificar o status antes de minerar.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'iron'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare class BatteryManager {
        capacity: number;
        constructor(cap: number);
        getPercent(): number;
      }
    `,
    starterCode: `async function main() {
  // Instancie a classe BatteryManager
  const manager = new BatteryManager(500);
  
  if (manager.getPercent() > 10) {
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'iron'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 7.2: Inheritance ─────────────────────────────────────────────────────
  {
    id: '7.2',
    chapter: 7,
    levelInChapter: 2,
    title: 'Evolução de Hardware',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#inheritance',
      section: 'Inheritance'
    },
    mission: {
      briefing: `Classes podem estender outras classes usando 'extends'. A subclasse herda todas as propriedades e métodos da classe base, mas pode sobrescrevê-los ou adicionar novos.\n\nO 'SuperDrone' é uma extensão do 'BasicDrone' com motores a jato.`,
      objective: "Implemente um SuperDrone que estenda o comportamento básico.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'empty', 'gold'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare class BasicDrone {
        move(x: number, y: number): Promise<void>;
      }
    `,
    starterCode: `class SuperDrone extends BasicDrone {
  async turboMove(x: number, y: number) {
    console.log("Ativando Turbo!");
    await this.move(x, y);
  }
}

async function main() {
  const drone = new SuperDrone();
  await drone.turboMove(2, 0);
  await mine();
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 7.3: Member Visibility (Private) ────────────────────────────────────
  {
    id: '7.3',
    chapter: 7,
    levelInChapter: 3,
    title: 'Sistemas Enclausurados',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility',
      section: 'Member Visibility'
    },
    mission: {
      briefing: `O TS permite controlar quem pode acessar propriedades e métodos usando 'public', 'protected' e 'private'.\n\n'private' impede o acesso até mesmo de subclasses. Tentar acessar 'encryptionKey' fora da classe resultará em erro de compilação.`,
      objective: "Use os métodos públicos de uma classe para acessar dados protegidos.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'crystal'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare class EncryptionModule {
        private key: string;
        public getStatus(): string;
        protected decrypt(): void;
      }
    `,
    starterCode: `async function main() {
  const module = new EncryptionModule();
  
  // O campo 'key' é privado e inacessível.
  // Use o método público getStatus().
  if (module.getStatus() === "READY") {
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 7.4: Static Members ──────────────────────────────────────────────────
  {
    id: '7.4',
    chapter: 7,
    levelInChapter: 4,
    title: 'O Cérebro Central',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members',
      section: 'Static Members'
    },
    mission: {
      briefing: `Membros estáticos pertencem à própria classe, não às instâncias. Eles são úteis para constantes globais ou funções utilitárias que não dependem do estado do objeto.\n\nConsulte os limites de radiação estática da classe 'Environment'.`,
      objective: "Acesse propriedades estáticas de uma classe sem instanciá-la.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'isotope'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare class Environment {
        static MAX_RADIATION: number;
        static isSafe(level: number): boolean;
      }
    `,
    starterCode: `async function main() {
  const currentRadiation = 450;
  
  // Use Environment.isSafe sem 'new'
  if (Environment.isSafe(currentRadiation)) {
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'isotope'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 7.5: Abstract Classes ────────────────────────────────────────────────
  {
    id: '7.5',
    chapter: 7,
    levelInChapter: 5,
    title: 'O Molde Ancestral',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members',
      section: 'Abstract Classes and Members'
    },
    mission: {
      briefing: `Classes abstratas servem como base para outras classes, mas não podem ser instanciadas diretamente. Elas podem conter 'métodos abstratos', que DEVEM ser implementados pelas subclasses.\n\nCrie um 'MiningDrone' real a partir do molde 'AbstractDrone'.`,
      objective: "Implemente um método abstrato em uma subclasse executável.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'iron', 'gold'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare abstract class AbstractDrone {
        abstract getTarget(): string;
        async run(): Promise<void>;
      }
    `,
    starterCode: `class MyDrone extends AbstractDrone {
  // Implemente o método obrigatório getTarget
  getTarget(): string {
    return "gold";
  }
}

async function main() {
  const drone = new MyDrone();
  
  if (drone.getTarget() === "gold") {
    await move(2, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  }
];
