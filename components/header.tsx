import { UserButton, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';


import { HeaderLogo } from '@/components/header-logo'
import { Navigation } from '@/components/navigation';

export const Header = () => {
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-wscreen-2xl mx-auto">
                <div className="flex items-center lg:gap-x-16">
                    <HeaderLogo />
                    <Navigation />
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl='/' />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className='size-8 animate-spin text-slate-400'></Loader2>
                    </ClerkLoading>
                    
                </div>
            </div>
        </header>
    );
};

export default Header