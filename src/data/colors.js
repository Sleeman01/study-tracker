// The 8 subject colors, in a fixed order. This order was tested with the
// dataviz color checker: neighbours stay distinguishable for colorblind users.
export const SUBJECT_COLORS = [
  { hex: '#2F6FDB', name: 'Blue' },
  { hex: '#E0A21B', name: 'Amber' },
  { hex: '#D9487A', name: 'Pink' },
  { hex: '#2A9BB8', name: 'Teal' },
  { hex: '#E06A2C', name: 'Orange' },
  { hex: '#7A55D6', name: 'Violet' },
  { hex: '#1F9A72', name: 'Green' },
  { hex: '#B5368F', name: 'Magenta' },
]

// The first color no subject is using yet (or blue if all are used)
export function nextFreeColor(subjects) {
  const used = new Set(subjects.map((s) => s.color))
  return (SUBJECT_COLORS.find((c) => !used.has(c.hex)) ?? SUBJECT_COLORS[0]).hex
}
