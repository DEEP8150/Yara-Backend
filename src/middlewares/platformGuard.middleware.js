const platformGuard = (req, res, next) => {
    const platform = req.headers['x-platform']; // 'web' | 'mobile'
    const appSignature = req.headers['x-app-signature'];
    const role = req.user?.role;

    console.log("PlatformGuard:", { platform, appSignature, role });

    const mobileOnlyRoles = ['customer', 'commissioning_engineer'];

    if (!platform) {
        return res.status(400).json({
            message: "Missing platform header."
        });
    }

    if (platform === 'web' && mobileOnlyRoles.includes(role)) {
        return res.status(403).json({
            message: "Access restricted to mobile app only."
        });
    }

    if (platform === 'mobile') {
        if (!appSignature || appSignature !== process.env.MOBILE_APP_SECRET) {
            return res.status(401).json({
                message: "Invalid or missing app signature."
            });
        }
    }

    next();
};

export default platformGuard;
