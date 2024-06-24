
export enum MissionTypeEnum {
    'Time Mission' = 1,
    'Goal Mission',
}

export enum MissionAvailabilityEnum {
    'Yes' = 1,
    'No'
}

export function enumToKeyValueArray(enumObj: any): Array<{ key: string, value: string }> {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key))) // Filter out numeric keys added by TypeScript
      .map(key => ({
        key: enumObj[key], // The value of the enum (1, 2, etc.)
        value: key // The key of the enum (TimeMission, GoalMission)
      }));
  }