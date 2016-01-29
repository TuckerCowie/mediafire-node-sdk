export const MF_CONFIG_UPDATE = 'MF_CONFIG_UPDATE';

export function updateConfig(newConfig) {
  return {
    type: MF_CONFIG_UPDATE,
    payload: newConfig
  };
}
