export function NightBackdrop({ track }: { track: 'network' | 'system' }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <img className="night-backdrop" src={`${base}/scenes/${track}-night.jpg`} alt="" fetchPriority="high" width={1600} height={900}/>;
}
