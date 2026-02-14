import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { logout } from "../app/features/authSlice";
import { toast } from "react-hot-toast";
import api from "../configs/api";

function Navbar() {

    const {user} = useSelector(state=>state.auth);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutUser =  async () => {
        const { data } = await api.post(`/api/users/logout`);
        navigate("/");
        dispatch(logout());
        toast.success(data.message);
    };
    return (
        <div className="shadow bg-white">
            <nav
                className="flex items-center justify-between max-w-7x1 mx-auto
            px-4 py-3.5 text-slate-800 transition-all"
            >
                <Link to="/">
                    <img src="/logo.svg" alt="Logo Image" className="h-11 w-auto" />
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    <p className="max-sm:hidden">Hi, {user?.name} </p>
                    <button
                        onClick={logoutUser}
                        className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
