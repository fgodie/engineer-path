export function NightBackdrop({ track, scene = 'night' }: { track: 'network' | 'system'; scene?: 'night' | 'orbit' }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <img className="night-backdrop" src={`${base}/scenes/${track}-${scene}.jpg`} alt="" fetchPriority="high" width={1600} height={900}/>;
}
