/** Ids deterministas para los recortes de cada RocketArt (mismo HTML en cada build). */
let count = 0;
export const nextRocketId = () => `rk-${++count}`;
