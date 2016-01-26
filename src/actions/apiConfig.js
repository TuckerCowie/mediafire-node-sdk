export const MF_UPDATE_API_CONFIG = 'MF_UPDATE_API_CONFIG';

export function updateApiConfig(newConfig) {
  return {
    type: MF_UPDATE_API_CONFIG,
    payload: newConfig
  };
}
