// Mock WebGPU backend to prevent import errors
// The pose-detection library tries to import this but we don't need it

export const webgpu_util = {}
export class WebGPUBackend {}
export default {}
