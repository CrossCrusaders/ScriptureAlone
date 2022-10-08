

export const animationFramePromise = () => new Promise((res) => requestAnimationFrame(res))
export const timeoutPromise = (delay: number) => new Promise((res) => setTimeout(res, delay))

export const defaultAnimationBezier = 'cubic-bezier(0.4, 0.0, 0.2, 1)'