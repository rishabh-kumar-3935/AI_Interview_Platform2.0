import Sidebar from "../components/Sidebar/Sidebar";
import {Outlet} from "react-router-dom";

function MainLayout(){
    return (
        <div className="flex">
            <Sidebar/>
            <main className="flex-1 bg-zinc-900 min-h-screen p-8 text-white">
                <Outlet/>
            </main>
        </div>
    );
}

export default MainLayout;