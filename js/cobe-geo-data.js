function meridian(lng, latFrom, latTo, steps = 18) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push([latFrom + ((latTo - latFrom) * i) / steps, lng]);
  }
  return points;
}

function parallel(lat, lngFrom, lngTo, steps = 24) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push([lat, lngFrom + ((lngTo - lngFrom) * i) / steps]);
  }
  return points;
}

// 七大洲 / 四大洋分界线（简化地理参考线）
export const GEO_BOUNDARIES = [
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: meridian(60, 42, 72),
  },
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: [
      [42, 48],
      [43, 44],
      [41, 38],
      [40, 32],
    ],
  },
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: meridian(32, 12, 31),
  },
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: parallel(36, -6, 36),
  },
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: meridian(-77, -56, 18),
  },
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: meridian(169, 65, 72),
  },
  {
    kind: 'continent',
    color: [0.92, 0.96, 1],
    points: parallel(-60, -180, 180, 36),
  },
  {
    kind: 'ocean',
    color: [0.58, 0.8, 0.98],
    points: meridian(-70, -55, 72),
  },
  {
    kind: 'ocean',
    color: [0.58, 0.8, 0.98],
    points: meridian(20, -55, 72),
  },
  {
    kind: 'ocean',
    color: [0.58, 0.8, 0.98],
    points: meridian(147, -50, 52),
  },
  {
    kind: 'ocean',
    color: [0.58, 0.8, 0.98],
    points: parallel(66.5, -180, 180, 36),
  },
];

// 地名标注（贴在球面上，非悬浮标签）
export const GEO_LABELS = [
  { id: 'asia', name: '亚洲', lat: 42, lng: 88, kind: 'continent' },
  { id: 'europe', name: '欧洲', lat: 54, lng: 28, kind: 'continent' },
  { id: 'africa', name: '非洲', lat: 2, lng: 22, kind: 'continent' },
  { id: 'na', name: '北美洲', lat: 48, lng: -101, kind: 'continent' },
  { id: 'sa', name: '南美洲', lat: -14, lng: -58, kind: 'continent' },
  { id: 'ant', name: '南极洲', lat: -78, lng: 0, kind: 'continent' },
  { id: 'oc', name: '大洋洲', lat: -24, lng: 138, kind: 'continent' },
  { id: 'pac', name: '太平洋', lat: 8, lng: -158, kind: 'ocean' },
  { id: 'atl', name: '大西洋', lat: 12, lng: -38, kind: 'ocean' },
  { id: 'ind', name: '印度洋', lat: -18, lng: 78, kind: 'ocean' },
  { id: 'arc', name: '北冰洋', lat: 80, lng: 10, kind: 'ocean' },
];

export function polylineToArcs(boundaries) {
  const arcs = [];
  boundaries.forEach((boundary) => {
    for (let i = 1; i < boundary.points.length; i += 1) {
      arcs.push({
        from: boundary.points[i - 1],
        to: boundary.points[i],
        color: boundary.color,
      });
    }
  });
  return arcs;
}
