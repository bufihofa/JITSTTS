module.exports = function(permissions) {
    return async function(req, res, next) {
        try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        // Check if the user has the required permissions
        const userPermissions = req.user.permissions || [];
        const hasPermission = permissions.every(perm => userPermissions.includes(perm));
    
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }
    
        // Proceed to the next middleware or controller
        return next();
        } catch (error) {
        console.error('Error in hasPerm middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}