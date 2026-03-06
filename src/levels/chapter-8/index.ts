import { ILevelDefinition } from '../../types/level';

export const chapter8Levels: ILevelDefinition[] = [
  // ─── 8.1: The keyof type operator ─────────────────────────────────────────
  {
    id: '8.1',
    chapter: 8,
    levelInChapter: 1,
    title: 'O Operador de Chaves',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html',
      section: 'The keyof type operator'
    },
    mission: {
      briefing: `A radiação magnética deformou o banco de dados. Precisamos de uma função que aceite apenas chaves válidas de um objeto de status do drone.\n\nO operador \`keyof\` cria uma união de todas as chaves (strings ou números) de um tipo objeto.`,
      objective: "Use 'keyof' para restringir o parâmetro da função aos atributos do drone.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'iron'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface DroneStatus {
        battery: number;
        position: string;
        cargo: number;
      }
      declare function getStatusValue(key: keyof DroneStatus): any;
    `,
    starterCode: `async function main() {
  // A função getStatusValue só aceita "battery" | "position" | "cargo"
  const batteryLevel = getStatusValue("battery");
  
  if (batteryLevel > 0) {
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

  // ─── 8.2: The typeof type operator ─────────────────────────────────────────
  {
    id: '8.2',
    chapter: 8,
    levelInChapter: 2,
    title: 'Clonagem de Tipos',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html',
      section: 'The typeof type operator'
    },
    mission: {
      briefing: `Temos um exemplo de dado recuperado do sensor, mas não temos a interface dele. Em vez de reescrever tudo, use \`typeof\` para extrair o tipo diretamente da constante de exemplo.\n\nIsso é útil quando lidamos com bibliotecas ou dados externos que não exportam seus tipos.`,
      objective: "Crie um tipo a partir de um valor existente usando 'typeof'.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'gold'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      const SENSOR_EXAMPLE = { id: "S-1", value: 100, active: true };
      declare function validateSensorData(data: typeof SENSOR_EXAMPLE): boolean;
    `,
    starterCode: `async function main() {
  // Use typeof SENSOR_EXAMPLE para tipar o novo sinal
  const newSignal: typeof SENSOR_EXAMPLE = {
    id: "S-2",
    value: 450,
    active: true
  };
  
  if (validateSensorData(newSignal)) {
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 8.3: Indexed Access Types ────────────────────────────────────────────
  {
    id: '8.3',
    chapter: 8,
    levelInChapter: 3,
    title: 'Acesso por Índice',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html',
      section: 'Indexed Access Types'
    },
    mission: {
      briefing: `Podemos usar tipos de acesso indexado para procurar o tipo de uma propriedade específica em outro tipo.\n\nSe tivermos um tipo \`Drone\`, podemos obter o tipo da bateria usando \`Drone["battery"]\`. Isso garante que se o tipo da bateria mudar no futuro, nosso código se adaptará automaticamente.`,
      objective: "Extraia o tipo de uma propriedade específica usando acesso indexado.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'crystal'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface DroneSystem {
        power: { voltage: number; stable: boolean };
        navigation: { x: number; y: number };
      }
      type PowerSystem = DroneSystem["power"];
      declare function checkPower(p: PowerSystem): boolean;
    `,
    starterCode: `async function main() {
  const currentPower: DroneSystem["power"] = {
    voltage: 12,
    stable: true
  };
  
  if (checkPower(currentPower)) {
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

  // ─── 8.4: Conditional Types ───────────────────────────────────────────────
  {
    id: '8.4',
    chapter: 8,
    levelInChapter: 4,
    title: 'Lógica Quântica',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html',
      section: 'Conditional Types'
    },
    mission: {
      briefing: `Tipos condicionais permitem que você tome decisões no nível de tipo: \`SomeType extends OtherType ? TrueType : FalseType\`.\n\nIsso permite que a API do drone retorne tipos diferentes dependendo da entrada, de forma puramente estática.`,
      objective: "Decifre o tipo condicional para extrair a carga correta.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'isotope'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface RawMaterial { raw: true }
      interface RefinedMaterial { refined: true }
      
      type Process<T> = T extends "raw" ? RawMaterial : RefinedMaterial;
      
      declare function downloadData<T extends "raw" | "refined">(mode: T): Process<T>;
    `,
    starterCode: `async function main() {
  // Se passarmos "raw", o retorno é RawMaterial
  const raw = downloadData("raw");
  
  if (raw.raw) {
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

  // ─── 8.5: Mapped Types ────────────────────────────────────────────────────
  {
    id: '8.5',
    chapter: 8,
    levelInChapter: 5,
    title: 'Blindagem de Dados',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
      section: 'Mapped Types'
    },
    mission: {
      briefing: `Tipos mapeados permitem que você pegue um tipo existente e transforme cada uma de suas propriedades.\n\nO ambiente magnético exige que todas as propriedades de configuração do drone sejam somente leitura (\`readonly\`).`,
      objective: "Transforme as propriedades de um objeto usando um Mapped Type.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'iron', 'crystal'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface BaseConfig {
        speed: number;
        range: number;
      }
      
      type ReadonlyConfig<T> = {
        readonly [P in keyof T]: T[P];
      };
      
      declare function applyStrictConfig(c: ReadonlyConfig<BaseConfig>): void;
    `,
    starterCode: `async function main() {
  const config: BaseConfig = { speed: 10, range: 100 };
  
  // Transforme em Readonly de forma mapeada
  const strict: ReadonlyConfig<BaseConfig> = config;
  
  applyStrictConfig(strict);
  
  await move(2, 0);
  await mine();
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
    scoring: {
      gold: { maxTicks: 3, maxBatteryUsed: 100 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 8.6: Template Literal Types ──────────────────────────────────────────
  {
    id: '8.6',
    chapter: 8,
    levelInChapter: 6,
    title: 'Protocolos de Resgate',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html',
      section: 'Template Literal Types'
    },
    mission: {
      briefing: `Os protocolos de resgate seguem um padrão estrito: \`RESUE_ID\` onde ID é uma letra e um número. Podemos usar Template Literal Types para validar essas strings em tempo de compilação.\n\nExemplo: \`type Protocols = \`PROTOCOL-\${'A' | 'B'}\` \`.`,
      objective: "Combine uniões de strings usando Template Literal Types.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'gold', 'isotope'],
    ],
    hardware: { maxBattery: 1000 },
    apiTypeDefs: `
      type Sector = "A" | "B";
      type Level = 1 | 2;
      type SecurityCode = \`CODE-\${Sector}\${Level}\`;
      
      declare function blastPortal(code: SecurityCode): Promise<void>;
    `,
    starterCode: `async function main() {
  // SecurityCode deve ser CODE-A1, CODE-A2, CODE-B1 ou CODE-B2
  const myCode: SecurityCode = "CODE-A1";
  
  await blastPortal(myCode);
  
  await move(2, 0);
  await mine();
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'isotope'),
    scoring: {
      gold: { maxTicks: 5, maxBatteryUsed: 150 },
      silver: { forbiddenPatterns: [] }
    }
  }
];
