import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
    const isLoggedIn = useSelector((state) => state.auth.status);

    if (isLoggedIn) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/10 bg-zinc-950/95 px-4 md:px-8">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 font-bold text-green-400">
                    AI
                </div>
                <div>
                    <p className="text-lg font-semibold text-white">AI Interview Platform</p>
                    <p className="text-xs text-zinc-400">Your prep hub</p>
                </div>
            </div>

            <nav className="ml-auto flex items-center gap-3">
                <Link
                    to="/signup"
                    className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                    Signup
                </Link>
                <Link
                    to="/login"
                    className="rounded-2xl bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-400"
                >
                    Login
                </Link>
            </nav>
        </header>
    );
}

export default Header;
