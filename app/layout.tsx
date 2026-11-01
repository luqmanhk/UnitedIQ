import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'UnitedIQ | Recruitment intelligence',description:'An independent football scouting and squad-building demo. Transparent decisions. A stronger United.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
