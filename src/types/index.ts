// types — 全局类型定义
// 待实现：全局 interface / enum / type

/** 轴向坐标（Axial Coordinates）：仅存储 q、r，s 由 -q-r 推导 */
export interface AxialCoord {
  q: number;
  r: number;
}

/** 立方体坐标（Cube Coordinates）：满足 q + r + s = 0 */
export interface CubeCoord {
  q: number;
  r: number;
  s: number;
}
