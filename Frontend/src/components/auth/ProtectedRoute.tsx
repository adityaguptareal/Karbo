import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && token && user && allowedRoles && !allowedRoles.includes(user.role || "")) {
            toast({
                title: "Unauthorized",
                description: "You are not authorized to access this page.",
                variant: "destructive"
            });
            navigate("/", { replace: true });
        }
    }, [token, user, isLoading, allowedRoles, navigate]);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Show loading while fetching user data
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role || "")) {
        // Return null while the useEffect handles the redirect and toast
        return null;
    }

    return <Outlet />;
};

export default ProtectedRoute;
