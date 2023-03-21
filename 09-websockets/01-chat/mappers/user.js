module.exports = function mapUser(user) {
    return {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        createdAr: user.createdAt,
        updatedAt: user.updatedAt,
    };
};