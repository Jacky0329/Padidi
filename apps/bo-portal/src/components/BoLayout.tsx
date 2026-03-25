import { Outlet } from 'react-router-dom';
import BoSidebar from './BoSidebar';

export default function BoLayout({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <BoSidebar />
            <main className="flex-1 p-6">{children ?? <Outlet />}</main>
        </div>
    );
}
