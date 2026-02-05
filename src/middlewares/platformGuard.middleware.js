const platformGuard = (req, res, next) => {
    const platform = req.headers['x-platform']; // 'web' | 'mobile'
    const appSignature = req.headers['x-app-signature'];
    const role = req.user?.role;

    console.log("PlatformGuard Check:", {
        role,
        platform,
        appSignature
    });

    if (!platform) {
        return res.status(400).json({ message: "Missing platform header." });
    }

    if (platform === 'mobile' && role === 'admin') {
        return res.status(403).json({ message: "Kindly use the web dashboard for admin access." });
    }

    const mobileOnlyRoles = ['customer', 'commissioning_engineer'];
    if (platform === 'web' && mobileOnlyRoles.includes(role)) {
        return res.status(403).json({ message: "This role is restricted to mobile app only." });
    }

    if (platform === 'mobile') {
        if (!appSignature || appSignature !== process.env.MOBILE_APP_SECRET) {
            return res.status(401).json({ message: "Invalid or missing app signature." });
        }
    }

    next();
};

export default platformGuard;
